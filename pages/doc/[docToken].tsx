import type { NextPage, GetServerSideProps } from "next";
import MarkdownIt from "markdown-it";

import { feishuDocumentFetcher } from "../../utils/feishu";
import { parseDocument } from "../../utils/parser";

interface DocProps {
  __html: any;
}

const Doc: NextPage<DocProps> = ({ __html }) => {
  return (
    <article
      className="prose prose-slate lg:prose-xl"
      dangerouslySetInnerHTML={{ __html }}
    />
  );
};

export const getServerSideProps: GetServerSideProps<DocProps> = async (
  context
) => {
  const { params } = context;
  const { content } = await feishuDocumentFetcher.getDocContent(
    params?.docToken as string
  );
  const markdown = parseDocument(JSON.parse(content));
  return { props: { __html: MarkdownIt().render(markdown) } };
};

export default Doc;
