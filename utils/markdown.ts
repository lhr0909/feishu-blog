import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

export function renderMarkdown(markdown: string): string {
  return MarkdownIt({
    linkify: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }

      return ""; // use external default escaping
    },
  }).render(markdown);
}
