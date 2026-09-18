import type { ReactNode } from "react";
import { EmptyState, PageHeader } from "./ui";
import type { IconName } from "./icon";

export function PlaceholderPage({ eyebrow, title, description, icon, emptyTitle, emptyDescription, action }: {
  eyebrow: string;
  title: string;
  description: string;
  icon: IconName;
  emptyTitle: string;
  emptyDescription: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-stack simple-page">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState icon={icon} title={emptyTitle} description={emptyDescription} action={action} />
    </div>
  );
}
