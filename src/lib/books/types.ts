export const readingStatuses = [
  "want_to_read",
  "reading",
  "finished",
  "paused",
] as const;

export type ReadingStatus = (typeof readingStatuses)[number];

export const readingStatusLabels: Record<ReadingStatus, string> = {
  want_to_read: "想读",
  reading: "在读",
  finished: "已读",
  paused: "暂停",
};

export type Book = {
  id: string;
  title: string;
  author: string | null;
  readingStatus: ReadingStatus;
  totalPages: number;
  currentPage: number;
  progressPercentage: number;
  finishedAt: string | null;
  lastReadAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function isReadingStatus(value: string): value is ReadingStatus {
  return readingStatuses.some((status) => status === value);
}

export function calculateReadingPercentage(currentPage: number, totalPages: number) {
  if (totalPages <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((currentPage / totalPages) * 100)));
}
