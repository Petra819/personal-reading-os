<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Personal Reading OS 开发规则

1. 开发前先阅读 `docs/PRD.md`、`docs/DESIGN.md`、`docs/DATABASE.md` 和 `docs/ROADMAP.md`，并确认当前阶段的范围与验收条件。
2. 保持 Next.js、TypeScript、Tailwind CSS、App Router 和 ESLint 技术栈；未经用户确认，不自行替换或扩展核心技术栈。
3. 一次只开发 `docs/ROADMAP.md` 中的一个阶段；开始下一阶段前先完成当前阶段的验收。
4. 不提前实现后续阶段的功能。可以为扩展留出清晰边界，但不要加入尚未需要的实现。
5. 新增依赖前，先说明用途、所属阶段、替代方案及维护成本，并取得用户确认。
6. 不在源代码、文档、提交记录或示例数据中写入真实 API Key、Secret 或其他凭据；使用环境变量和安全的示例占位符。
7. 所有页面与交互都要考虑桌面、平板和手机布局，以及触控和键盘可用性。
8. 优先保证代码清晰、可维护和可逐步验证，避免一次生成大量难以审查的代码。
9. 完成一个阶段后，运行该阶段必要的 lint、类型检查、构建或人工交互检查，并记录结果与未验证事项。
10. 完成任务后，向用户说明修改文件、检查结果、遗留问题和下一步建议。
