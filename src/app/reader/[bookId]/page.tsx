import Link from "next/link";
import { EmptyState, MockBookCover } from "@/components/ui";
import { currentBook } from "@/data/mock";

export default function ReaderPlaceholder() {
  return (
    <div className="reader-message">
      <MockBookCover size="small" />
      <EmptyState
        icon="book"
        title="阅读器还在准备中"
        description={`《${currentBook.title}》暂时还不能打开。EPUB 与 PDF 阅读功能即将开放。`}
        action={<Link href="/" className="button button-primary">返回首页</Link>}
      />
    </div>
  );
}
