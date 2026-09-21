import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { BookForm } from "./book-form";

export const metadata: Metadata = {
  title: "添加书籍 | Personal Reading OS",
  description: "向个人书架添加一本书。",
};

export default function NewBookPage() {
  return (
    <div className="page-stack add-book-page">
      <Link className="quiet-link add-book-back" href="/library">← 返回书架</Link>
      <PageHeader
        eyebrow="ADD TO LIBRARY"
        title="添加一本书"
        description="先记录最基本的信息。书籍文件导入将在后续阶段开放。"
      />

      <section className="add-book-layout" aria-labelledby="book-details-heading">
        <div className="add-book-guidance">
          <p className="eyebrow">BOOK DETAILS</p>
          <h2 id="book-details-heading">书籍信息</h2>
          <p>页码用于当前阶段的手动阅读进度记录，不代表 EPUB 或 PDF 的真实阅读位置。</p>
        </div>
        <BookForm />
      </section>
    </div>
  );
}
