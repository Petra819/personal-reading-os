# Personal Reading OS 数据模型规划

## 1. 范围与约定

本文规划未来 Supabase/PostgreSQL 的关系模型，不创建数据库、迁移、存储桶或客户端。V0.2 开始接入用户系统时，需根据当时的 Supabase 版本与需求复核字段、索引和访问策略。

- 主键建议使用 UUID；时间使用 `timestamptz`，统一存 UTC，展示时按用户时区转换。
- 个人数据表都有 `user_id`；服务端与数据库访问规则必须校验所有权。
- `created_at` 和 `updated_at` 用于排序与同步；删除策略在各阶段确定，避免误删关联内容。
- 书籍原文件存私有对象存储，数据库只保存路径和元数据；不把 EPUB/PDF 二进制写入普通表。
- 分类与标签不同：书籍可有一个分类文本，标签是跨内容复用的多对多实体。若分类管理变复杂，再独立建表。

## 2. 核心实体

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

### Book

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | `uuid` PK | 书籍 ID |
| `user_id` | `uuid` FK | 所有者 |
| `title`, `author` | `text` | 书名必填；作者可为空 |
| `category` | `text` nullable | 单一分类 |
| `format` | `text` | V1 约束为 `epub` / `pdf`；TXT 待定 |
| `storage_path` | `text` | 私有原文件路径 |
| `cover_path` | `text` nullable | 私有封面路径或后续生成资源 |
| `file_size_bytes`, `file_hash` | `bigint`, `text` nullable | 导入校验与重复检测辅助信息 |
| `reading_status` | `text` | `want_to_read` / `reading` / `finished` / `paused` |
| `added_at`, `finished_at` | `timestamptz` | 入库与完成时间；后者可为空 |
| `created_at`, `updated_at` | `timestamptz` | 审计时间 |

书籍的进度与阅读位置以 `ReadingProgress` 为准，不在 `Book` 内维护第二份可变进度。一本书由一个用户拥有；同一文件可以由不同用户各自导入。

### ReadingProgress

| 字段 | 建议类型 | 说明 |
| --- | --- | --- |
| `id` | `uuid` PK | 记录 ID |
| `user_id`, `book_id` | `uuid` FK | 所有者与书籍；建议 `unique(user_id, book_id)` |
| `locator_type` | `text` | `epub_cfi` / `pdf_page` 等 |
| `locator` | `jsonb` | 格式化位置，例如 CFI 或页码与视图位置 |
| `progress_ratio` | `numeric(5,4)` | 0–1 的显示进度 |
| `last_read_at` | `timestamptz` | 最近阅读时间 |
| `updated_at` | `timestamptz` | 位置更新时间 |

阅读位置更新需考虑跨设备最后写入冲突；V0.6 确定以时间戳或版本号为准的合并策略。阅读时长需要独立的 `ReadingSession`（建议字段：`user_id`, `book_id`, `started_at`, `ended_at`, `active_seconds`），在 V0.6 设计并在 V0.9 用于统计；不能仅从进度推算阅读时长。

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

## 3. 引用与关系

- `User 1—N Book / Note / Entry / Tag`。
- `Book 1—1 ReadingProgress`（对单个用户的一本书），`Book 1—N Note`，`Book 1—N Entry`（主要关联）。
- `Book N—M Tag`、`Note N—M Tag`、`Entry N—M Tag`，分别通过三张关联表实现。
- 心得与随笔引用笔记，随笔引用书籍和灵感时，建议使用有真实外键的 `EntryBookReference(entry_id, book_id)`、`EntryNoteReference(entry_id, note_id)`、`EntryEntryReference(entry_id, target_entry_id)`。这些表属于对应功能阶段的设计，不在本次创建。应阻止自引用及跨用户引用。
- V2.0 双向链接与知识图谱可以基于引用关系扩展，但不在 V1.0 提前实现通用图谱结构。

## 4. 位置、搜索与安全

- EPUB 位置优先保存稳定 CFI，PDF 保存页码并视需要保存选区坐标及摘录文本。位置应与 `format`、文件版本或哈希一起校验，避免换文件后错误跳转。
- 常用索引建议覆盖各表 `user_id, updated_at`，以及 `Book(user_id, reading_status)`、`Note(user_id, book_id)`、`Entry(user_id, type)` 和标签关联键。V0.9 再按实际查询确定全文检索索引和中文分词方案。
- Supabase 阶段对所有个人内容和关联表启用 RLS；对象存储使用私有桶，读取 URL 需受控。服务端也应检查 `user_id`，不能只依赖前端筛选。
- 删除书籍时需要决定笔记、心得与引用如何处理。倾向保留用户写作内容并将来源标记为不可用，具体外键删除行为在 V0.3/V0.7 落地前确定。
