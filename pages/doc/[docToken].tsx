import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

import { feishuDocumentFetcher } from "../../utils/feishu";
import { parseDocument } from "../../utils/parser";
import { Container } from "../../components/Container";

import 'highlight.js/styles/base16/zenburn.css';

interface DocProps {
  title: string;
  __html: string;
}

const Doc: NextPage<DocProps> = ({ title, __html }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Container>
        <h1 className="mb-8 text-4xl font-medium">{title}</h1>
        <article
          className="prose prose-slate md:prose-lg"
          dangerouslySetInnerHTML={{ __html }}
        />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<DocProps> = async (
  context
) => {
  const { params } = context;
  const { content } = await feishuDocumentFetcher.getDocContent(
    params?.docToken as string
  );
  const { title, body } = parseDocument(JSON.parse(content));
  return {
    props: {
      title,
      __html: MarkdownIt({
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(str, { language: lang }).value;
            } catch (__) {}
          }

          return ""; // use external default escaping
        },
      }).render(body),
    },
  };
};

export default Doc;
