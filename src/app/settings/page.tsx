import Link from "next/link";
import { Icon } from "@/components/icon";
import { PageHeader } from "@/components/ui";
import { SignOutForm } from "./sign-out-form";

const destinations = [
  { label: "阅读心得", href: "/reflections", detail: "记录一本书带来的思考" },
  { label: "灵感", href: "/ideas", detail: "收集问题、观点与写作线索" },
  { label: "随笔", href: "/writing", detail: "让想法慢慢成为文章" },
  { label: "搜索", href: "/search", detail: "从阅读空间找回内容" },
] as const;

export default function SettingsPage() {
  return (
    <div className="page-stack simple-page">
      <PageHeader eyebrow="YOUR SPACE" title="我的空间" description="从这里前往其他内容页面，并管理当前登录状态。" />
      <section className="settings-section" aria-labelledby="explore-heading">
        <p className="eyebrow">EXPLORE</p>
        <h2 id="explore-heading" className="section-title">更多空间</h2>
        <div className="destination-list">
          {destinations.map((item) => (
            <Link href={item.href} className="destination-row" key={item.href}>
              <span><strong>{item.label}</strong><small>{item.detail}</small></span>
              <Icon name="chevron" width={18} height={18} />
            </Link>
          ))}
        </div>
      </section>
      <section className="settings-section" aria-labelledby="preferences-heading">
        <p className="eyebrow">PREFERENCES</p>
        <h2 id="preferences-heading" className="section-title">偏好设置</h2>
        <p className="settings-note">阅读主题与标签管理即将逐步开放。</p>
      </section>
      <section className="settings-section" aria-labelledby="account-heading">
        <p className="eyebrow">ACCOUNT</p>
        <h2 id="account-heading" className="section-title">个人账户</h2>
        <p className="settings-note">当前空间采用个人单用户模式，不开放公开注册。</p>
        <SignOutForm />
      </section>
    </div>
  );
}
