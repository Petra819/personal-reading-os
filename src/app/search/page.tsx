import { Icon } from "@/components/icon";
import { EmptyState, PageHeader } from "@/components/ui";

export default function SearchPage() {
  return (
    <div className="page-stack simple-page">
      <PageHeader eyebrow="SEARCH" title="搜索" description="未来可在书籍、笔记与灵感之间找回一条线索。" />
      <div className="search-preview">
        <label htmlFor="global-search">搜索你的阅读空间</label>
        <div className="search-field"><Icon name="search" width={20} height={20} /><input id="global-search" type="search" placeholder="搜索功能即将开放" disabled /></div>
        <p>搜索暂不可用。之后可以从这里找回你的阅读内容。</p>
      </div>
      <EmptyState icon="search" title="要寻找什么？" description="以后，读过的书、记下的句子和转瞬即逝的想法，都可以从这里找到。" />
    </div>
  );
}
