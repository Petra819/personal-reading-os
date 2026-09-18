"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./icon";

const primaryLinks: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "首页", icon: "home" },
  { href: "/library", label: "书架", icon: "book" },
  { href: "/notes", label: "笔记", icon: "note" },
  { href: "/ideas", label: "灵感", icon: "spark" },
  { href: "/writing", label: "随笔", icon: "pen" },
];

const secondaryLinks: { href: string; label: string; icon: IconName }[] = [
  { href: "/reflections", label: "阅读心得", icon: "note" },
  { href: "/search", label: "搜索", icon: "search" },
  { href: "/settings", label: "设置", icon: "settings" },
];

const CaptureContext = createContext<() => void>(() => {});

export function QuickCaptureTrigger({ children, className = "button button-primary" }: { children: ReactNode; className?: string }) {
  const openCapture = useContext(CaptureContext);
  return <button type="button" className={className} onClick={openCapture}>{children}</button>;
}

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className="brand" onClick={onNavigate} aria-label="Personal Reading OS 首页">
      <span className="brand-mark"><Icon name="book" width={21} height={21} /></span>
      <span className="brand-copy"><strong>Reading OS</strong><small>你的个人阅读空间</small></span>
    </Link>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const renderLink = ({ href, label, icon }: { href: string; label: string; icon: IconName }) => (
    <Link
      key={href}
      href={href}
      className={`side-link${pathname === href ? " is-current" : ""}`}
      aria-current={pathname === href ? "page" : undefined}
      onClick={onNavigate}
    >
      <Icon name={icon} width={19} height={19} />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="side-nav" aria-label="主导航">
      <p className="nav-caption">空间</p>
      {primaryLinks.map(renderLink)}
      <div className="nav-divider" />
      <p className="nav-caption">更多</p>
      {secondaryLinks.map(renderLink)}
    </nav>
  );
}

function MobileNav({ pathname, onCapture }: { pathname: string; onCapture: () => void }) {
  const links: { href: string; label: string; icon: IconName }[] = [
    primaryLinks[0],
    primaryLinks[1],
    primaryLinks[2],
    { href: "/settings", label: "我的", icon: "settings" },
  ];

  return (
    <nav className="mobile-nav" aria-label="底部导航">
      {links.slice(0, 2).map(({ href, label, icon }) => (
        <Link key={href} href={href} className={`mobile-link${pathname === href ? " is-current" : ""}`} aria-current={pathname === href ? "page" : undefined}>
          <Icon name={icon} width={21} height={21} /><span>{label}</span>
        </Link>
      ))}
      <button className="mobile-capture" type="button" onClick={onCapture} aria-label="快速记录（即将开放）">
        <Icon name="plus" width={23} height={23} />
      </button>
      {links.slice(2).map(({ href, label, icon }) => (
        <Link key={href} href={href} className={`mobile-link${pathname === href || (href === "/settings" && ["/ideas", "/writing", "/search", "/reflections"].includes(pathname)) ? " is-current" : ""}`} aria-current={pathname === href ? "page" : undefined}>
          <Icon name={icon} width={21} height={21} /><span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [captureOpen, setCaptureOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLElement>(null);
  const isReader = pathname.startsWith("/reader/");

  useEffect(() => {
    const dialog = captureOpen ? captureRef.current : menuOpen ? menuRef.current : null;
    if (!dialog) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    focusable[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        setCaptureOpen(false);
      } else if (event.key === "Tab" && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [menuOpen, captureOpen]);

  if (isReader) {
    return (
      <div className="reader-frame">
        <header className="reader-topbar">
          <Link href="/" className="quiet-link">← 返回阅读空间</Link>
          <span>阅读器预留页面</span>
        </header>
        <main id="main-content" className="reader-placeholder">{children}</main>
      </div>
    );
  }

  return (
    <CaptureContext.Provider value={() => setCaptureOpen(true)}>
    <div className="app-shell">
      <aside className="desktop-sidebar" aria-label="侧边栏">
        <Brand />
        <NavLinks pathname={pathname} />
        <p className="sidebar-footnote">让每一次阅读，都有回响。</p>
      </aside>

      <div className="app-body">
        <header className="compact-header">
          <button type="button" className="icon-button" onClick={() => setMenuOpen(true)} aria-label="打开导航菜单" aria-expanded={menuOpen} aria-controls="tablet-navigation">
            <Icon name="menu" width={23} height={23} />
          </button>
          <Link href="/" className="compact-brand">Reading OS</Link>
          <Link href="/search" className="icon-button" aria-label="前往搜索"><Icon name="search" width={21} height={21} /></Link>
        </header>
        <main id="main-content" className="content-wrap">{children}</main>
      </div>

      <MobileNav pathname={pathname} onCapture={() => setCaptureOpen(true)} />

      {menuOpen && (
        <div className="drawer-backdrop" onMouseDown={() => setMenuOpen(false)}>
          <div id="tablet-navigation" ref={menuRef} className="nav-drawer" role="dialog" aria-modal="true" aria-label="导航菜单" onMouseDown={(event) => event.stopPropagation()}>
            <div className="drawer-head"><Brand onNavigate={() => setMenuOpen(false)} /><button type="button" className="icon-button" onClick={() => setMenuOpen(false)} aria-label="关闭导航菜单"><Icon name="close" width={21} height={21} /></button></div>
            <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      {captureOpen && (
        <div className="capture-backdrop" onMouseDown={() => setCaptureOpen(false)}>
          <section ref={captureRef} className="capture-panel" role="dialog" aria-modal="true" aria-labelledby="capture-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="capture-head"><p className="eyebrow">QUICK CAPTURE</p><button type="button" className="icon-button" onClick={() => setCaptureOpen(false)} aria-label="关闭快速记录面板"><Icon name="close" width={20} height={20} /></button></div>
            <h2 id="capture-title">留住这一刻的想法</h2>
            <p>未来可以从这里快速创建灵感、笔记、心得或随笔。</p>
            <div className="capture-types" aria-label="未来支持的记录类型"><span>灵感</span><span>笔记</span><span>心得</span><span>随笔</span></div>
            <p className="capture-note">记录与保存功能即将开放。</p>
          </section>
        </div>
      )}
    </div>
    </CaptureContext.Provider>
  );
}
