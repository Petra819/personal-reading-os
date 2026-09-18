import { PlaceholderPage } from "@/components/placeholder-page";

export default function LibraryPage() {
  return (
    <PlaceholderPage
      eyebrow="YOUR LIBRARY"
      title="我的书架"
      description="把想读和正在读的书，安放在同一个地方。"
      icon="book"
      emptyTitle="你的书架还是空的"
      emptyDescription="以后导入的 EPUB 和 PDF 会出现在这里。书籍导入即将开放。"
      action={<button type="button" className="button button-primary" disabled title="书籍导入即将开放">添加第一本书</button>}
    />
  );
}
