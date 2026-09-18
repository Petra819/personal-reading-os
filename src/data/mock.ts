export const currentBook = {
  id: "mock-book",
  title: "置身事内",
  author: "兰小欢",
  subtitle: "中国政府与经济发展",
  chapter: "第六章 · 房价与居民债务",
  progress: 68,
  lastRead: "昨日阅读",
} as const;

export const recentEntries = [
  {
    id: "entry-1",
    type: "阅读笔记",
    title: "从地方财政看城市的生长",
    excerpt: "一个城市的变化，往往藏在资源如何流动的细节里。",
    source: "《置身事内》",
    date: "9月17日",
  },
  {
    id: "entry-2",
    type: "灵感",
    title: "把读过的内容变成自己的问题",
    excerpt: "或许可以从一个反常识的问题开始下一篇文章。",
    source: null,
    date: "9月16日",
  },
  {
    id: "entry-3",
    type: "阅读心得",
    title: "理解一座城市的另一种方式",
    excerpt: "读完这一章，再看熟悉的街道，也会多出一层新的视角。",
    source: "《置身事内》",
    date: "9月14日",
  },
] as const;

export const readingSummary = [
  { label: "本周阅读", value: "3h 42m", detail: "一段安静的时间" },
  { label: "正在阅读", value: "3 本", detail: "慢慢读，也很好" },
  { label: "本月笔记", value: "18 条", detail: "留下值得再看的想法" },
] as const;
