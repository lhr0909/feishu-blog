export enum BlockType {
  TextRun = 'textRun',
  Paragraph = 'paragraph',
  Code = 'code',
}

export interface LocationMetadata {
  zoneId: string;
  startIndex: number;
  endIndex: number;
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
    style: Record<string, any>;
    location: LocationMetadata;
  };
}

export interface ParagraphBlock extends Block {
  type: BlockType.Paragraph;
  paragraph: {
    elements: Block[];
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
  return blocks.map((block) => {
    switch (block.type) {
      case BlockType.TextRun:
        return `${(block as TextRunBlock).textRun.text}`;
      case BlockType.Paragraph:
        return `${parseBlocks((block as ParagraphBlock).paragraph.elements, paragraphLineBreaks)}${'\n'.repeat(paragraphLineBreaks)}`;
      case BlockType.Code:
        return `\`\`\`${(block as CodeBlock).code.language.toLowerCase()}\n${parseBlocks((block as CodeBlock).code.body.blocks, 1)}\`\`\`\n\n`;
      default:
        throw new Error(`Unknown block type: ${block.type}`);
    }
  }).join('');
}

export function parseDocument(doc: Document): { title: string; body: string } {
  let titleString = '';
  let bodyString = '';
  let { title, body } = doc;
  if (title) {
    titleString += parseBlocks(title.elements);
  }
  if (body) {
    bodyString += parseBlocks(body.blocks);
  }
  return { title: titleString, body: bodyString };
}
