import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "登录 | Personal Reading OS",
  description: "登录你的个人阅读空间。",
};

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-layout">
        <section className="login-intro" aria-labelledby="login-title">
          <div className="login-brand" aria-label="Personal Reading OS">
            <span className="brand-mark"><Icon name="book" width={21} height={21} /></span>
            <span>Reading OS</span>
          </div>
          <p className="eyebrow">PERSONAL READING SPACE</p>
          <h1 id="login-title">回到你的阅读空间</h1>
          <p>书籍、笔记与思考，在这里安静地继续生长。</p>
        </section>

        <section className="login-panel" aria-labelledby="sign-in-heading">
          <p className="eyebrow">WELCOME BACK</p>
          <h2 id="sign-in-heading">登录</h2>
          <p className="login-description">使用你的个人账户继续。</p>
          <LoginForm />
          <p className="login-note">当前空间仅供个人使用，不开放注册。</p>
        </section>
      </div>
    </main>
  );
}
