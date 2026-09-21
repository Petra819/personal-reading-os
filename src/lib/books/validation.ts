import { isReadingStatus, type ReadingStatus } from "./types";

const POSTGRES_INTEGER_MAX = 2_147_483_647;

export type BookFormValues = {
  title: string;
  author: string;
  readingStatus: string;
  totalPages: string;
  currentPage: string;
};

export type BookFormErrors = Partial<Record<keyof BookFormValues, string>>;

export type NewBookInput = {
  title: string;
  author: string | null;
  readingStatus: ReadingStatus;
  totalPages: number;
  currentPage: number;
};

function getTextValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function parsePostgresInteger(value: string) {
  const normalized = value.trim();

  if (!/^\d+$/.test(normalized)) {
    return null;
  }

  const number = Number(normalized);
  return Number.isSafeInteger(number) && number <= POSTGRES_INTEGER_MAX ? number : null;
}

export function validateBookForm(formData: FormData) {
  const values: BookFormValues = {
    title: getTextValue(formData, "title"),
    author: getTextValue(formData, "author"),
    readingStatus: getTextValue(formData, "reading_status"),
    totalPages: getTextValue(formData, "total_pages"),
    currentPage: getTextValue(formData, "current_page"),
  };
  const errors: BookFormErrors = {};
  const title = values.title.trim();
  const author = values.author.trim();
  const totalPages = parsePostgresInteger(values.totalPages);
  const currentPage = parsePostgresInteger(values.currentPage);

  if (!title) {
    errors.title = "请输入书名。";
  }

  if (!isReadingStatus(values.readingStatus)) {
    errors.readingStatus = "请选择有效的阅读状态。";
  }

  if (totalPages === null || totalPages <= 0) {
    errors.totalPages = "总页数必须是大于 0 的整数。";
  }

  if (currentPage === null) {
    errors.currentPage = "当前页数必须是大于或等于 0 的整数。";
  } else if (totalPages !== null && currentPage > totalPages) {
    errors.currentPage = "当前页数不能超过总页数。";
  }

  if (
    Object.keys(errors).length > 0
    || totalPages === null
    || currentPage === null
    || !isReadingStatus(values.readingStatus)
  ) {
    return { values, errors, input: null };
  }

  const input: NewBookInput = {
    title,
    author: author || null,
    readingStatus: values.readingStatus,
    totalPages,
    currentPage,
  };

  return { values, errors, input };
}
