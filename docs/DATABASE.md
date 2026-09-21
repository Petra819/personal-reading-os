# Personal Reading OS 数据模型规划

## 1. 范围与约定

本文同时记录已经部署的 V0.2 Supabase/PostgreSQL 数据基础，以及后续阶段的关系模型规划。V0.2 已落地 Supabase Auth、`books`、`reading_progress`、RLS、约束、触发器和最小 RPC；Note、Entry、Tag、文件存储与阅读器位置仍只是规划。

- 主键建议使用 UUID；时间使用 `timestamptz`，统一存 UTC，展示时按用户时区转换。
- 个人数据表都有 `user_id`；服务端与数据库访问规则必须校验所有权。
- `created_at` 和 `updated_at` 用于排序与同步；删除策略在各阶段确定，避免误删关联内容。
- 书籍原文件存私有对象存储，数据库只保存路径和元数据；不把 EPUB/PDF 二进制写入普通表。
- 分类与标签不同：书籍可有一个分类文本，标签是跨内容复用的多对多实体。若分类管理变复杂，再独立建表。

## 2. V0.2 数据基础范围

V0.2 只落地 Supabase Auth、`books` 和 `reading_progress`，用于完成“登录 → 手动添加书籍 → 查看书籍详情 → 更新当前页 → Dashboard 显示最新进度”的最小闭环。

- V0.2 的书籍是手动创建的元数据记录，不包含 EPUB/PDF 文件、文件格式、存储路径或真实封面上传。
- `current_page` 是用户主动填写的人工页码记录，适用于纸质书或具有稳定页码的内容；它不等同于 EPUB CFI、PDF 阅读器内部页码/坐标或可自动恢复的阅读位置。
- 阅读百分比由 `current_page / total_pages` 在查询或展示层计算并限制在 0–100%，V0.2 不额外持久化一份可能过期的百分比。
- EPUB/PDF 文件、私有对象存储及文件元数据在 V0.3 增加；EPUB/PDF 的真实内容位置与阅读会话在 V0.6 增加。
- V0.2 不创建 Note、Entry、Tag 等后续业务表；以下对应模型继续作为后续阶段规划保留。

## 3. 核心实体

### User

使用 Supabase Auth 的 `auth.users.id` 作为身份来源；应用可建立 `users`/`profiles` 表，以相同 UUID 作为主键并引用 `auth.users(id)`。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | `uuid` PK/FK | 账户 ID |
| `display_name` | `text` nullable | 显示名称 |
| `timezone` | `text` | 阅读统计的日期边界；默认值在注册时确定 |
| `preferences` | `jsonb` | 少量外观与阅读偏好；稳定字段可以后提升为列 |
| `created_at`, `updated_at` | `timestamptz` | 审计时间 |

认证凭据只由 Supabase Auth 管理，不复制密码或 Secret 到应用表。

### Book / `books`（V0.2）

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | `uuid` PK | 书籍 ID，默认生成 UUID |
| `user_id` | `uuid` FK not null | 所有者，引用 `auth.users(id)` |
| `title` | `text` not null | 书名；去除首尾空白后不可为空 |
| `author` | `text` nullable | 作者可为空，界面使用明确的未知作者状态 |
| `reading_status` | `text` not null | 默认 `want_to_read`；约束为 `want_to_read` / `reading` / `finished` / `paused` |
| `total_pages` | `integer` not null | 人工进度的总页数，必须大于 0 |
| `finished_at` | `timestamptz` nullable | 进入 `finished` 且为空时自动记录时间；离开 `finished` 时自动清空 |
| `created_at`, `updated_at` | `timestamptz` not null | 审计时间，默认当前时间 |

书籍的可变进度以 `reading_progress` 为准，不在 `books` 内维护第二份当前页。建议为 `(id, user_id)` 建立唯一约束，供进度表使用复合外键，防止书籍与进度属于不同用户。

V0.3 再为 `books` 增加或复核 `category`、`format`、`storage_path`、`cover_path`、`file_size_bytes` 和 `file_hash`。`format` 届时约束为 `epub` / `pdf`；TXT 是否支持仍待定。书籍原文件放入私有对象存储，不写入普通数据库列。

### ReadingProgress / `reading_progress`（V0.2）

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | `uuid` PK | 记录 ID，默认生成 UUID |
| `user_id` | `uuid` FK not null | 所有者，引用 `auth.users(id)` |
| `book_id` | `uuid` FK not null | 所属书籍；与 `user_id` 组成复合外键并级联删除 |
| `current_page` | `integer` not null | 人工记录的当前页，默认 0，不得小于 0 或超过书籍 `total_pages` |
| `last_read_at` | `timestamptz` nullable | 用户实际更新页码的最近时间，供 Dashboard 选择继续阅读书籍 |
| `created_at`, `updated_at` | `timestamptz` not null | 创建和更新时间，默认当前时间 |

每位用户的每本书只保留一条记录，使用 `unique(user_id, book_id)`。跨表的 `current_page <= total_pages` 不能只依靠普通 `CHECK` 完成，迁移中需要使用受测试的数据库函数或触发器保证；添加书籍与初始进度应在同一事务内完成。

V0.2 的 `current_page` 不作为未来阅读器的定位字段。V0.6 再增加或拆分 `locator_type`、`locator`、文件版本校验与跨设备冲突策略，用于 EPUB CFI、PDF 页面及视图位置。阅读时长使用独立 `ReadingSession`（建议字段：`user_id`, `book_id`, `started_at`, `ended_at`, `active_seconds`），不能仅从人工页码或百分比推算。

### Note

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | `uuid` PK | 笔记 ID |
| `user_id` | `uuid` FK | 所有者 |
| `book_id` | `uuid` FK nullable | 快速记录可暂不关联书籍 |
| `chapter_title` | `text` nullable | 章节显示信息，避免目录变化时丢失上下文 |
| `excerpt` | `text` nullable | 原文摘录/高亮文本 |
| `body` | `text` nullable | 用户笔记正文 |
| `highlight_color` | `text` nullable | 可选高亮样式 |
| `locator_type`, `locator` | `text`, `jsonb` nullable | EPUB CFI、PDF 页码及选区等来源位置 |
| `created_at`, `updated_at` | `timestamptz` | 创建和更新时间 |

约束建议：`excerpt` 或 `body` 至少有一项非空。只有存在有效 `book_id` 与位置时才能返回原文。高亮可作为带摘录和位置的 Note；如果后续需要无笔记高亮，仍可让 `body` 为空。

### Entry

统一承载灵感、心得和随笔，避免三套重复的生命周期逻辑。

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | `uuid` PK | 条目 ID |
| `user_id` | `uuid` FK | 所有者 |
| `type` | `text` | `idea` / `reflection` / `essay` |
| `title` | `text` nullable | 灵感可无标题；随笔可使用标题 |
| `body` | `text` | 正文；V1 先保存明确的文本格式 |
| `body_format` | `text` | 例如 `plain`，未来可增加 `markdown` |
| `book_id` | `uuid` FK nullable | 心得的主要来源书籍；灵感与随笔也可选择关联 |
| `chapter_title` | `text` nullable | 章节心得的章节信息 |
| `created_at`, `updated_at` | `timestamptz` | 创建和更新时间 |

`type = reflection` 时允许整书（无章节）或章节心得。随笔引用多个来源时不依赖单个 `book_id`，见下方引用关系。

### Tag 与 EntryTag

| 实体 | 字段 | 说明 |
| --- | --- | --- |
| `Tag` | `id`, `user_id`, `name`, `created_at`, `updated_at` | 用户自己的标签；建议 `unique(user_id, normalized_name)`，避免仅大小写或空白不同的重复标签 |
| `EntryTag` | `entry_id`, `tag_id`, `created_at` | Entry 与 Tag 的多对多关系；复合主键 `(entry_id, tag_id)` |

为满足书籍和笔记同样可打标签，还需要 `BookTag(book_id, tag_id)` 与 `NoteTag(note_id, tag_id)`，各自使用复合主键。关联双方必须属于同一用户；不能只靠单列外键推断跨用户关联安全，实际迁移中要用复合约束或受 RLS 保护的写入策略保证。

## 4. V0.2 已部署实现

V0.2 使用以下两份 migration，均已部署并经过实际流程验证：

- `supabase/migrations/20260920000000_create_books_and_reading_progress.sql`
- `supabase/migrations/20260921000000_update_book_reading_state.sql`

### 数据完整性与触发器

- `books(id, user_id)` 唯一约束与 `reading_progress(book_id, user_id)` 复合外键共同保证进度记录和书籍属于同一用户；删除书籍时对应进度级联删除。
- `validate_reading_progress_page()` 读取并锁定对应书籍，阻止 `current_page` 超过数据库中的 `total_pages`，并在页码变化时更新 `last_read_at`。
- `validate_book_total_pages()` 阻止把总页数降到已有当前页数以下，并与进度校验使用一致的锁顺序策略。
- `set_updated_at()` 统一刷新 `updated_at`；用于 `books` 时同时维护 `finished_at` 与 `reading_status` 的一致性。
- 标题在创建 RPC 中使用 `btrim()` 后的值；作者会去除首尾空白，纯空白作者保存为 `null`。

### 原子 RPC

- `create_book_with_progress(...)` 使用 `auth.uid()` 作为所有者，在同一函数调用中创建 `books` 和初始 `reading_progress`，客户端不能传入 `user_id`。
- `update_book_reading_state(p_book_id, p_current_page, p_reading_status)` 锁定当前用户的书籍行，使用数据库真实 `total_pages` 校验页码，并在同一事务中更新页码与阅读状态；任一步失败都会回滚整个调用。
- 两个 RPC 都是 `SECURITY INVOKER`，设置空 `search_path` 并完整限定对象名称。`PUBLIC` 与 `anon` 没有执行权限，只有 `authenticated` 可以调用。
- `last_read_at`、`finished_at` 和 `updated_at` 继续由触发器维护，RPC 不复制这些规则。

### RLS、Grants 与索引

- `books` 和 `reading_progress` 均启用 RLS。SELECT、INSERT、UPDATE、DELETE policy 都要求 `auth.uid()` 非空且等于行内 `user_id`。
- `anon` 没有两张个人数据表的读取或写入权限；`authenticated` 拥有表级 SELECT、INSERT、UPDATE、DELETE 权限，但每次操作仍必须通过 RLS。V0.2 应用界面没有提供删除操作。
- 已创建 `books(user_id, reading_status, updated_at desc)` 与 `reading_progress(user_id, last_read_at desc)` 索引，服务于书架、状态筛选和继续阅读排序。

## 5. 引用与关系

- `User 1—N Book / Note / Entry / Tag`。
- `Book 1—1 ReadingProgress`（对单个用户的一本书），`Book 1—N Note`，`Book 1—N Entry`（主要关联）。
- `Book N—M Tag`、`Note N—M Tag`、`Entry N—M Tag`，分别通过三张关联表实现。
- 心得与随笔引用笔记，随笔引用书籍和灵感时，建议使用有真实外键的 `EntryBookReference(entry_id, book_id)`、`EntryNoteReference(entry_id, note_id)`、`EntryEntryReference(entry_id, target_entry_id)`。这些表属于对应功能阶段的设计，不在本次创建。应阻止自引用及跨用户引用。
- V2.0 双向链接与知识图谱可以基于引用关系扩展，但不在 V1.0 提前实现通用图谱结构。

## 6. 位置、搜索与安全

- V0.2 建议索引 `books(user_id, reading_status, updated_at)` 与 `reading_progress(user_id, last_read_at)`；后续索引覆盖 `Note(user_id, book_id)`、`Entry(user_id, type)` 和标签关联键。V0.9 再按实际查询确定全文检索索引和中文分词方案。
- 所有位于暴露 schema 的个人数据表必须启用 RLS，并撤销 `anon` 不需要的权限；只向 `authenticated` 授予产品实际使用的操作。
- V0.2 的表级权限包含 SELECT、INSERT、UPDATE、DELETE，但所有操作都由 `auth.uid() is not null` 且等于行内 `user_id` 的 RLS policy 约束。应用界面当前只开放查询、创建和更新流程，没有删除入口。服务端写入同样重新验证当前用户，不能只依赖前端筛选或路由保护。
- RLS 验收至少使用两个测试用户覆盖允许与拒绝路径，确认用户 A 不能读取或修改用户 B 的书籍和进度。浏览器与普通 Server Action 不使用绕过 RLS 的 `service_role` Key。
- V0.3 的书籍文件使用私有对象存储，读取 URL 需受控。V0.6 中 EPUB 位置优先保存稳定 CFI，PDF 保存页码并视需要保存选区坐标及摘录文本；位置需要与文件版本或哈希一起校验，避免换文件后错误跳转。
- 删除书籍时需要决定笔记、心得与引用如何处理。倾向保留用户写作内容并将来源标记为不可用，具体外键删除行为在 V0.3/V0.7 落地前确定。
