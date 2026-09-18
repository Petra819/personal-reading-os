import type { ReactNode } from "react";
import { Icon, type IconName } from "./icon";

export function PageHeader({ eyebrow, title, description }: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="page-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="page-title">{title}</h1>
      {description && <p className="page-description">{description}</p>}
    </header>
  );
}

export function SectionHeader({ eyebrow, title, aside, id }: {
  eyebrow?: string;
  title: string;
  aside?: ReactNode;
  id?: string;
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="section-title">{title}</h2>
      </div>
      {aside && <div className="section-aside">{aside}</div>}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: {
  icon: IconName;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="empty-state" aria-label={title}>
      <div className="empty-icon"><Icon name={icon} width={26} height={26} /></div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action && <div className="empty-action">{action}</div>}
    </section>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label="阅读进度"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <span className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

export function MockBookCover({ size = "large" }: { size?: "large" | "small" }) {
  return (
    <div className={`book-cover book-cover--${size}`} aria-label="《置身事内》封面占位图" role="img">
      <span className="cover-overline">READING NOTES · 01</span>
      <span className="cover-title">置身<br />事内</span>
      <span className="cover-bottom">兰小欢 著</span>
    </div>
  );
}
