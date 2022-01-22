import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";

import { feishuDocumentFetcher } from "../../utils/feishu";
import { parseDocument } from "../../utils/parser";
import { renderMarkdown } from "../../utils/markdown";

import { Container } from "../../components/Container";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

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
        <Header title={title} />
        <article
          className="prose prose-slate md:prose-lg"
          dangerouslySetInnerHTML={{ __html }}
        />
        <Footer />
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
      __html: renderMarkdown(body),
    },
  };
};

export default Doc;
