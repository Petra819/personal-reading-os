import Link from "next/link";
import { notFound } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { ProgressBar } from "@/components/ui";
import { getBookById } from "@/lib/books/queries";
import { readingStatusLabels } from "@/lib/books/types";
import { ReadingProgressForm } from "./reading-progress-form";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export default async function BookDetailPage({
  params,
}: PageProps<"/library/[bookId]">) {
  const { bookId } = await params;
  const { book, error } = await getBookById(bookId);

  if (error) {
    return (
      <div className="page-stack book-detail-page">
        <Link className="quiet-link book-detail-back" href="/library">← 返回书架</Link>
        <section className="library-error" role="alert" aria-labelledby="book-error-title">
          <p className="eyebrow">BOOK UNAVAILABLE</p>
          <h1 id="book-error-title">暂时无法读取这本书</h1>
          <p>{error}</p>
        </section>
      </div>
    );
  }

  if (!book) {
    notFound();
  }

  return (
    <article className="page-stack book-detail-page">
      <nav className="book-detail-nav" aria-label="书籍详情导航">
        <Link className="quiet-link book-detail-back" href="/library">← 返回书架</Link>
        <Link className="button button-secondary" href="/library/new">添加书籍</Link>
      </nav>

      <section className="book-detail-hero" aria-labelledby="book-title">
        <div className="book-detail-cover">
          <BookCover title={book.title} author={book.author} size="fluid" />
        </div>

        <div className="book-detail-copy">
          <p className="book-detail-status">
            <span className="status-dot" aria-hidden="true" />
            {readingStatusLabels[book.readingStatus]}
          </p>
          <h1 id="book-title">{book.title}</h1>
          <p className="book-detail-author">{book.author || "作者未填写"}</p>

          <div className="book-detail-progress" aria-label="阅读进度详情">
            <div className="book-detail-progress-heading">
              <span>阅读进度</span>
              <strong>{book.progressPercentage}%</strong>
            </div>
            <ProgressBar value={book.progressPercentage} />
            <p>已读 {book.currentPage} 页，共 {book.totalPages} 页</p>
          </div>
        </div>
      </section>

      <section className="reading-update-section" aria-labelledby="reading-update-heading">
        <div className="reading-update-intro">
          <p className="eyebrow">UPDATE PROGRESS</p>
          <h2 id="reading-update-heading">记录阅读进度</h2>
          <p>更新当前页数和阅读状态。页码仍是当前阶段的人工记录。</p>
        </div>
        <ReadingProgressForm
          key={book.id}
          bookId={book.id}
          currentPage={book.currentPage}
          totalPages={book.totalPages}
          readingStatus={book.readingStatus}
        />
      </section>

      <section className="book-detail-meta" aria-labelledby="book-record-heading">
        <div>
          <p className="eyebrow">BOOK RECORD</p>
          <h2 id="book-record-heading">记录信息</h2>
        </div>
        <dl>
          <div>
            <dt>添加时间</dt>
            <dd><time dateTime={book.createdAt}>{formatDate(book.createdAt)}</time></dd>
          </div>
          <div>
            <dt>最近更新</dt>
            <dd><time dateTime={book.updatedAt}>{formatDate(book.updatedAt)}</time></dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
