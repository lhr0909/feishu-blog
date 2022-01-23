import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import classNames from "classnames";

import { feishuDocumentFetcher } from "../../utils/feishu";
import { parseDocument } from "../../utils/parser";
import { renderMarkdown } from "../../utils/markdown";

import { Container } from "../../components/Container";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

import 'highlight.js/styles/agate.css';

interface DocProps {
  title: string;
  __html: string;
  data: { [key: string]: any };
}

const proseClassNames = classNames(
  "prose",
  "prose-slate",
  "md:prose-lg",
  "prose-a:text-blue-500",
  "prose-a:no-underline",
  "prose-a:font-normal",
  "prose-p:my-3",
  "md:prose-p:my-4",
);

const Doc: NextPage<DocProps> = ({ title, __html }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Container>
        <Header title={title} />
        <article
          className={proseClassNames}
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
  const { title, content: body, data } = parseDocument(JSON.parse(content));
  return {
    props: {
      title,
      __html: renderMarkdown(body),
      data,
    },
  };
};

export default Doc;
