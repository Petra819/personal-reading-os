import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { EmptyState, PageHeader, ProgressBar } from "@/components/ui";
import { getBooks } from "@/lib/books/queries";
import { readingStatusLabels } from "@/lib/books/types";

export default async function LibraryPage() {
  const { books, error } = await getBooks();

  return (
    <div className="page-stack library-page">
      <div className="library-page-header">
        <PageHeader
          eyebrow="YOUR LIBRARY"
          title="我的书架"
          description="把想读和正在读的书，安放在同一个地方。"
        />
        <Link className="button button-primary" href="/library/new">添加书籍</Link>
      </div>

      {error ? (
        <section className="library-error" role="alert" aria-labelledby="library-error-title">
          <p className="eyebrow">LIBRARY UNAVAILABLE</p>
          <h2 id="library-error-title">暂时无法打开书架</h2>
          <p>{error}</p>
        </section>
      ) : books.length === 0 ? (
        <EmptyState
          icon="book"
          title="你的书架还是空的"
          description="先手动添加一本书。未来导入的 EPUB 和 PDF 也会出现在这里。"
          action={<Link href="/library/new" className="button button-primary">添加第一本书</Link>}
        />
      ) : (
        <section aria-label="书籍列表">
          <div className="library-grid">
            {books.map((book) => (
              <Link className="library-book" href={`/library/${book.id}`} key={book.id}>
                <BookCover title={book.title} author={book.author} size="fluid" />
                <div className="library-book-copy">
                  <p className="library-book-status">
                    <span className="status-dot" aria-hidden="true" />
                    {readingStatusLabels[book.readingStatus]}
                  </p>
                  <h2>{book.title}</h2>
                  <p className="library-book-author">{book.author || "作者未填写"}</p>
                  <div className="library-book-progress">
                    <div className="progress-meta">
                      <span>{book.currentPage} / {book.totalPages} 页</span>
                      <strong>{book.progressPercentage}%</strong>
                    </div>
                    <ProgressBar value={book.progressPercentage} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
