import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/ui";

export default function BookNotFound() {
  return (
    <div className="page-stack simple-page">
      <PageHeader
        eyebrow="BOOK NOT FOUND"
        title="没有找到这本书"
        description="这条书籍记录不存在，或当前账户没有查看权限。"
      />
      <EmptyState
        icon="book"
        title="回到你的书架"
        description="你可以从书架重新选择一本书，或添加新的阅读记录。"
        action={<Link className="button button-primary" href="/library">返回书架</Link>}
      />
    </div>
  );
}
