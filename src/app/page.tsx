import Link from "next/link";
import { QuickCaptureTrigger } from "@/components/app-shell";
import { BookCover } from "@/components/book-cover";
import { Icon } from "@/components/icon";
import { EmptyState, ProgressBar, SectionHeader } from "@/components/ui";
import { getBooks } from "@/lib/books/queries";
import type { Book, ReadingStatus } from "@/lib/books/types";

const summaryItems: Array<{
  status: ReadingStatus;
  label: string;
  detail: string;
}> = [
  { status: "reading", label: "正在阅读", detail: "当前进行中" },
  { status: "finished", label: "已读", detail: "已经读完" },
  { status: "want_to_read", label: "想读", detail: "留给以后" },
  { status: "paused", label: "暂停", detail: "暂时放下" },
];

function getTimestamp(value: string | null) {
  if (!value) {
    return 0;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function selectCurrentReadingBook(books: Book[]) {
  return books
    .filter((book) => book.readingStatus === "reading")
    .sort((first, second) => (
      getTimestamp(second.lastReadAt) - getTimestamp(first.lastReadAt)
      || getTimestamp(second.updatedAt) - getTimestamp(first.updatedAt)
    ))[0] ?? null;
}

export default async function Home() {
  const { books, error } = await getBooks();
  const currentReadingBook = error ? null : selectCurrentReadingBook(books);
  const bookCounts = books.reduce<Record<ReadingStatus, number>>((counts, book) => {
    counts[book.readingStatus] += 1;
    return counts;
  }, {
    want_to_read: 0,
    reading: 0,
    finished: 0,
    paused: 0,
  });

  return (
    <div className="dashboard page-stack">
      <header className="dashboard-intro">
        <div>
          <p className="eyebrow">PERSONAL READING OS</p>
          <h1 className="welcome-title">你好，今天也适合读几页。</h1>
          <p className="welcome-copy">给阅读留一点时间，让想法慢慢沉淀。</p>
        </div>
      </header>

      <section aria-labelledby="continue-heading" className="dashboard-section">
        <SectionHeader
          id="continue-heading"
          eyebrow="CURRENTLY READING"
          title="继续阅读"
          aside={currentReadingBook ? <span className="section-note">最近阅读</span> : undefined}
        />

        {error ? (
          <div className="dashboard-data-state" role="alert">
            <div className="empty-icon"><Icon name="book" width={26} height={26} /></div>
            <div>
              <h3>暂时无法读取书架</h3>
              <p>请稍后刷新页面重试。</p>
            </div>
          </div>
        ) : currentReadingBook ? (
          <div className="featured-book">
            <BookCover title={currentReadingBook.title} author={currentReadingBook.author} />
            <div className="featured-copy">
              <p className="book-status"><span className="status-dot" aria-hidden="true" /> 正在阅读</p>
              <h3>{currentReadingBook.title}</h3>
              <p className="book-author">{currentReadingBook.author || "作者未填写"}</p>
              <div className="book-progress">
                <div className="progress-meta">
                  <span>{currentReadingBook.currentPage} / {currentReadingBook.totalPages} 页</span>
                  <strong>{currentReadingBook.progressPercentage}%</strong>
                </div>
                <ProgressBar value={currentReadingBook.progressPercentage} />
              </div>
              <div className="featured-actions">
                <Link className="button button-primary" href={`/library/${currentReadingBook.id}`}>
                  查看详情 <Icon name="arrow" width={18} height={18} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-reading-empty">
            <EmptyState
              icon="book"
              title="当前没有正在阅读的书"
              description="从书架选择一本书并标记为“在读”，它就会出现在这里。"
              action={<Link className="button button-primary" href="/library">前往书架</Link>}
            />
          </div>
        )}
      </section>

      <div className="dashboard-lower">
        <section aria-labelledby="records-heading" className="dashboard-section recent-section">
          <SectionHeader id="records-heading" eyebrow="NOTES & IDEAS" title="记录空间" />
          <div className="feature-pending">
            <div className="empty-icon"><Icon name="note" width={25} height={25} /></div>
            <div>
              <h3>最近记录将在后续阶段接入</h3>
              <p>笔记、灵感与心得尚未建立真实数据来源，因此这里暂不展示模拟内容。</p>
            </div>
          </div>
        </section>

        <aside className="dashboard-aside" aria-label="书架摘要与快速记录">
          <section className="summary-section">
            <SectionHeader eyebrow="YOUR LIBRARY" title="书架摘要" />
            {error ? (
              <p className="summary-unavailable" role="status">书籍统计暂时不可用。</p>
            ) : (
              <dl className="summary-list">
                {summaryItems.map((item) => (
                  <div className="summary-row" key={item.status}>
                    <dt>{item.label}<small>{item.detail}</small></dt>
                    <dd>{bookCounts[item.status]} 本</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
          <section className="capture-callout" aria-labelledby="capture-callout-title">
            <p className="eyebrow">A PLACE FOR IDEAS</p>
            <h2 id="capture-callout-title">有想法，先记下来。</h2>
            <p>快速记录将在后续阶段开放。现在可以先查看交互入口。</p>
            <QuickCaptureTrigger className="text-action">
              查看快速记录 <Icon name="arrow" width={17} height={17} />
            </QuickCaptureTrigger>
          </section>
        </aside>
      </div>
    </div>
  );
}
