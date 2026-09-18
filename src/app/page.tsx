import Link from "next/link";
import { QuickCaptureTrigger } from "@/components/app-shell";
import { Icon } from "@/components/icon";
import { MockBookCover, ProgressBar, SectionHeader } from "@/components/ui";
import { currentBook, recentEntries, readingSummary } from "@/data/mock";

export default function Home() {
  return (
    <div className="dashboard page-stack">
      <header className="dashboard-intro">
        <div>
          <p className="eyebrow">PERSONAL READING OS <span className="eyebrow-dot">·</span> 9月18日 星期五</p>
          <h1 className="welcome-title">你好，今天也适合读几页。</h1>
          <p className="welcome-copy">给阅读留一点时间，让想法慢慢沉淀。</p>
        </div>
      </header>

      <section aria-labelledby="continue-heading" className="dashboard-section">
        <SectionHeader id="continue-heading" eyebrow="CURRENTLY READING" title="继续阅读" aside={<span className="section-note">上次停在这里</span>} />
        <div className="featured-book">
          <MockBookCover />
          <div className="featured-copy">
            <p className="book-status"><span className="status-dot" /> 正在阅读 <span className="middot">·</span> {currentBook.lastRead}</p>
            <h3>{currentBook.title}</h3>
            <p className="book-author">{currentBook.author} <span className="middot">·</span> {currentBook.subtitle}</p>
            <p className="book-chapter">{currentBook.chapter}</p>
            <div className="book-progress"><div className="progress-meta"><span>阅读进度</span><strong>{currentBook.progress}%</strong></div><ProgressBar value={currentBook.progress} /></div>
            <div className="featured-actions">
              <Link className="button button-primary" href={`/reader/${currentBook.id}`}>继续阅读 <Icon name="arrow" width={18} height={18} /></Link>
              <span className="action-hint">阅读器即将开放</span>
            </div>
          </div>
        </div>
      </section>

      <div className="dashboard-lower">
        <section aria-labelledby="recent-heading" className="dashboard-section recent-section">
          <SectionHeader id="recent-heading" eyebrow="RECENT THOUGHTS" title="最近记录" />
          <div className="entry-list">
            {recentEntries.map((entry) => (
              <article className="entry-row" key={entry.id}>
                <div className="entry-meta"><span className="entry-type">{entry.type}</span><span>{entry.date}</span></div>
                <h3>{entry.title}</h3>
                <p className="entry-excerpt">{entry.excerpt}</p>
                {entry.source && <p className="entry-source">来自 {entry.source}</p>}
              </article>
            ))}
          </div>
        </section>

        <aside className="dashboard-aside" aria-label="阅读摘要与快速记录">
          <section className="summary-section">
            <SectionHeader eyebrow="A LITTLE PROGRESS" title="阅读摘要" />
            <dl className="summary-list">
              {readingSummary.map((item) => (
                <div className="summary-row" key={item.label}>
                  <dt>{item.label}<small>{item.detail}</small></dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="capture-callout" aria-labelledby="capture-callout-title">
            <p className="eyebrow">A PLACE FOR IDEAS</p>
            <h2 id="capture-callout-title">有想法，先记下来。</h2>
            <p>不必等它完整。未来可以从这里开始一条灵感或笔记。</p>
            <QuickCaptureTrigger className="text-action">查看快速记录 <Icon name="arrow" width={17} height={17} /></QuickCaptureTrigger>
          </section>
        </aside>
      </div>
    </div>
  );
}
