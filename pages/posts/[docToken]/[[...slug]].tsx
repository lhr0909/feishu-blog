import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import classNames from "classnames";
import { pinyin } from "pinyin-pro";
import { format } from 'date-fns';

import { feishuDocumentFetcher } from "../../../utils/feishu";
import { parseDocument } from "../../../utils/parser";
import { renderMarkdown } from "../../../utils/markdown";

import { Layout } from "../../../components/Layout";

import "highlight.js/styles/agate.css";

interface DocProps {
  siteTitle: string;
  postTitle: string;
  __html: string;
  postFrontmatter: { [key: string]: any };
  createdAt: string;
  createdBy: string;
}

const proseClassNames = classNames(
  "prose",
  "prose-slate",
  "md:prose-lg",
  "prose-a:text-blue-500",
  "hover:prose-a:underline",
  "prose-a:no-underline",
  "prose-a:font-normal",
  "prose-p:my-3",
  "md:prose-p:my-4"
);

const Doc: NextPage<DocProps> = ({ siteTitle, postTitle, createdAt, createdBy, __html, postFrontmatter }) => {
  return (
    <>
      <Head>
        <title>{postTitle} - {siteTitle}</title>
      </Head>
      <Layout siteTitle={siteTitle}>
        <h1 className="text-2xl font-medium inline-block">{postTitle}</h1>
        <div className="text-gray-500 text-sm mt-1">
          {`${createdAt} ${createdBy}`}
        </div>
        <article
          className={proseClassNames}
          dangerouslySetInnerHTML={{ __html }}
        />
      </Layout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const folderToken = process.env.FOLDER_TOKEN!;
  const { children } = await feishuDocumentFetcher.getFolderChildren(
    folderToken
  );

  const paths = await Promise.all(
    Object.keys(children)
      .map(async (key) => {
        const { name, token: docToken, type } = children[key];
        if (type !== "doc") {
          return null;
        }

        const { content } = await feishuDocumentFetcher.getDocContent(docToken);
        const { title: postTitle, data: postFrontmatter } = parseDocument(
          JSON.parse(content)
        );

        return {
          params: {
            docToken,
            slug:
              postFrontmatter.slug as string ||
              pinyin(postTitle, { toneType: "none" }).replace(/\s*/g, "-"),
          },
        };
      })
      .filter((item) => !!item)
  ) as unknown as { params: { [key: string]: string | string[] } }[];

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<DocProps> = async (context) => {
  const folderToken = process.env.FOLDER_TOKEN!;
  const { name: siteTitle } = await feishuDocumentFetcher.getFolderMeta(
    folderToken
  );

  const { params } = context;
  const { docToken } = params!;

  const {
    title: postTitle,
    create_time,
    edit_time,
    create_user_name,
    edit_user_name,
  } = await feishuDocumentFetcher.getDocMeta(docToken as string);

  const { content } = await feishuDocumentFetcher.getDocContent(docToken as string);
  const { content: body, data: postFrontmatter } = parseDocument(
    JSON.parse(content)
  );
  const __html = renderMarkdown(body);

  return {
    props: {
      siteTitle,
      postTitle: postTitle as string,
      createdAt: format(new Date(create_time * 1000), "yyyy-MM-dd"),
      createdBy: create_user_name,
      __html,
      postFrontmatter,
    },
    revalidate: 600,
  };
};

export default Doc;
