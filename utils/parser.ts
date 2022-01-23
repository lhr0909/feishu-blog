import matter from 'gray-matter';

export enum BlockType {
  TextRun = "textRun",
  Paragraph = "paragraph",
  Code = "code",
}

export interface LocationMetadata {
  zoneId: string;
  startIndex: number;
  endIndex: number;
}

export interface TextRunStyle {
  link?: {
    url: string;
  };
  [key: string]: any;
}

export interface ParagraphStyle {
  list?: {
    type: "bullet" | "number";
    indentLevel: number;
    number?: number;
  };
  [key: string]: any;
}

export interface Body {
  blocks: Block[];
}

export interface Block {
  type: BlockType;
}

export interface TextRunBlock extends Block {
  type: BlockType.TextRun;
  textRun: {
    text: string;
    style: TextRunStyle;
    location: LocationMetadata;
  };
}

export interface ParagraphBlock extends Block {
  type: BlockType.Paragraph;
  paragraph: {
    elements: Block[];
    style?: ParagraphStyle;
    location: LocationMetadata;
    lineId: string;
  };
}

export interface CodeBlock extends Block {
  type: BlockType.Code;
  code: {
    language: string;
    location: LocationMetadata;
    zoneId: string;
    body: Body;
  };
}

export interface Document {
  title: {
    elements: Block[];
    location: LocationMetadata;
    lineId: string;
  };
  body: Body;
}

function parseBlocks(blocks: Block[], paragraphLineBreaks = 2): string {
  return blocks
    .map((block, idx) => {
      switch (block.type) {
        case BlockType.TextRun: {
          const { textRun } = block as TextRunBlock;
          if (textRun.style.link) {
            return `[${textRun.text}](${decodeURIComponent(
              textRun.style.link.url
            )})`;
          }

          return `${textRun.text}`;
        }
        case BlockType.Paragraph: {
          const { paragraph } = block as ParagraphBlock;
          if (paragraph.style && paragraph.style.list) {
            if (paragraph.style.list.type === "bullet") {
              return `${"  ".repeat(
                paragraph.style.list.indentLevel
              )}- ${parseBlocks(
                paragraph.elements,
                paragraphLineBreaks
              )}${"\n".repeat(paragraphLineBreaks)}`;
            }
            if (paragraph.style.list.type === "number") {
              return `${"  ".repeat(paragraph.style.list.indentLevel)}${
                paragraph.style.list.number
              }. ${parseBlocks(
                paragraph.elements,
                paragraphLineBreaks
              )}${"\n".repeat(paragraphLineBreaks)}`;
            }
          }
          return `${parseBlocks(
            paragraph.elements,
            paragraphLineBreaks
          )}${"\n".repeat(paragraphLineBreaks)}`;
        }
        case BlockType.Code: {
          const { code } = block as CodeBlock;

          if (idx === 0 && code.language.toLowerCase() === "yaml") {
            // frontmatter
            return `---\n${parseBlocks(code.body.blocks, 1)}\n---\n`;
          }

          return `\`\`\`${(
            block as CodeBlock
          ).code.language.toLowerCase()}\n${parseBlocks(
            (block as CodeBlock).code.body.blocks,
            1
          )}\`\`\`\n\n`;
        }
        default:
          throw new Error(`Unknown block type: ${block.type}`);
      }
    })
    .join("");
}

export function parseDocument(doc: Document): matter.GrayMatterFile<string> & { title: string } {
  let titleString = "";
  let bodyString = "";
  let { title, body } = doc;
  if (title) {
    titleString += parseBlocks(title.elements);
  }
  if (body) {
    bodyString += parseBlocks(body.blocks);
  }
  return { title: titleString, ...matter(bodyString) };
}
