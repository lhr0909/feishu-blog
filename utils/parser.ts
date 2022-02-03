import matter from "gray-matter";

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
  codeInline?: boolean;
  bold?: boolean;
  italic?: boolean;
  [key: string]: any;
}

export interface ParagraphStyle {
  headingLevel: number;
  quote?: boolean;
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

function parseBlocks(
  blocks: Block[],
  paragraphLineBreaks = 2,
  prefix = ""
): string {
  return blocks
    .map((block, idx) => {
      switch (block.type) {
        case BlockType.TextRun: {
          const { textRun } = block as TextRunBlock;
          let text = textRun.text;

          if (textRun.style.link) {
            text = `[${textRun.text}](${decodeURIComponent(
              textRun.style.link.url
            )})`;
          }

          if (textRun.style.codeInline) {
            text = `\`${text}\``;
          }

          if (textRun.style.bold) {
            text = `**${text}**`;
          }

          if (textRun.style.italic) {
            text = `*${text}*`;
          }

          return text;
        }
        case BlockType.Paragraph: {
          const { paragraph } = block as ParagraphBlock;

          if (paragraph.style) {
            if (paragraph.style.quote && !prefix.startsWith(">")) {
              prefix += "> ";
            }

            if (!paragraph.style.quote && prefix.startsWith(">")) {
              prefix = prefix.replace(/>\s/g, "");
            }

            if (paragraph.style.headingLevel) {
              return (
                `${prefix}#`.repeat(paragraph.style.headingLevel) +
                ` ${parseBlocks(
                  paragraph.elements,
                  paragraphLineBreaks,
                  prefix
                )}\n\n`
              );
            }

            if (paragraph.style.list) {
              if (paragraph.style.list.type === "bullet") {
                return `${prefix}${"  ".repeat(
                  paragraph.style.list.indentLevel - 1
                )}- ${parseBlocks(paragraph.elements, 1, prefix)}\n\n`;
              }

              if (paragraph.style.list.type === "number") {
                return `${prefix}${"  ".repeat(
                  paragraph.style.list.indentLevel - 1
                )}${paragraph.style.list.number}. ${parseBlocks(
                  paragraph.elements,
                  1,
                  prefix
                )}\n\n`;
              }
            }
          }

          return `${prefix}${parseBlocks(
            paragraph.elements,
            paragraphLineBreaks,
            prefix
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

export function parseDocument(
  doc: Document
): matter.GrayMatterFile<string> & { title: string } {
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

// import fs from "fs/promises";
// import { resolve as pathResolve } from "path";

// async function main() {
//   const testFixture = await fs.readFile(
//     pathResolve(process.cwd(), "test.json")
//   );
//   const fixture = JSON.parse(testFixture.toString());
//   console.log(parseBlocks(fixture.blocks));
// }

// main();
