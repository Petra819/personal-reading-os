type BookCoverProps = {
  title: string;
  author?: string | null;
  size?: "large" | "small" | "fluid";
};

function getTitleLines(title: string) {
  const characters = Array.from(title.trim());

  if (!title.includes(" ") && characters.length >= 4 && characters.length <= 8) {
    const midpoint = Math.ceil(characters.length / 2);
    return [characters.slice(0, midpoint).join(""), characters.slice(midpoint).join("")];
  }

  return [title];
}

export function BookCover({ title, author, size = "large" }: BookCoverProps) {
  const normalizedTitle = title.trim() || "未命名";
  const titleLines = getTitleLines(normalizedTitle);
  const compactTitle = Array.from(normalizedTitle).length > 8;

  return (
    <div
      className={`book-cover book-cover--${size}${compactTitle ? " has-compact-title" : ""}`}
      aria-label={`《${normalizedTitle}》文字封面`}
      role="img"
    >
      <span className="cover-overline">PERSONAL LIBRARY</span>
      <span className="cover-title">
        {titleLines.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}
      </span>
      <span className="cover-bottom">{author?.trim() ? `${author.trim()} 著` : "作者未填写"}</span>
    </div>
  );
}
