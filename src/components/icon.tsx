import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "home"
  | "book"
  | "note"
  | "spark"
  | "pen"
  | "search"
  | "settings"
  | "plus"
  | "menu"
  | "close"
  | "arrow"
  | "chevron";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

export function Icon({ name, ...props }: IconProps) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></>,
    book: <><path d="M12 6c-2.4-1.5-5.2-1.9-9-1.5v14c3.8-.4 6.6 0 9 1.5 2.4-1.5 5.2-1.9 9-1.5v-14c-3.8-.4-6.6 0-9 1.5Z" /><path d="M12 6v14" /></>,
    note: <><path d="M6 3.5h9l3 3V21H6a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" /><path d="M14.5 3.5v4H18M8 12h6M8 16h6" /></>,
    spark: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 17l.6 1.4L21 19l-1.4.6L19 21l-.6-1.4L17 19l1.4-.6L19 17Z" /></>,
    pen: <><path d="M4 20h16M7 16.5l9.8-9.8a2.1 2.1 0 0 1 3 3L10 19.5l-4 1 1-4Z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.7" /><path d="m16 16 4.5 4.5" /></>,
    settings: <><circle cx="12" cy="12" r="3.5" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4m10.6 10.6 1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" /></>,
    plus: <path d="M12 4v16M4 12h16" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M5 5l14 14M19 5 5 19" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    chevron: <path d="m9 5 7 7-7 7" />,
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
