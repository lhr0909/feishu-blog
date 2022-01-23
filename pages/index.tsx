import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { feishuDocumentFetcher } from "../utils/feishu";

import { Layout } from "../components/Layout";
import { format } from "date-fns";
import { pinyin } from "pinyin-pro";
import { parseDocument } from "../utils/parser";

interface HomeProps {
  siteTitle: string;
  posts: Array<{
    slug: string;
    docToken: string;
    postTitle: string;
    createdAt: string;
  }>;
}

const Home: NextPage<HomeProps> = ({ siteTitle, posts }) => {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Layout siteTitle={siteTitle}>
        {posts.map((post) => {
          return (
            <h3 key={post.docToken}>
              <Link href={`/posts/${post.slug}`} passHref>
                <a className="text-blue-500 hover:underline text-lg">
                  {post.postTitle}
                </a>
              </Link>
              <span className="text-gray-500 text-sm ml-2">
                {post.createdAt}
              </span>
            </h3>
          );
        })}
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const folderToken = process.env.FOLDER_TOKEN!;
  const { name: siteTitle } = await feishuDocumentFetcher.getFolderMeta(
    folderToken
  );
  const { children } = await feishuDocumentFetcher.getFolderChildren(
    folderToken
  );

  const posts = (await Promise.all(
    Object.keys(children)
      .map(async (key) => {
        const { name, token: docToken, type } = children[key];
        if (type !== "doc") {
          return null;
        }

        const {
          title: postTitle,
          create_time,
          edit_time,
          create_user_name,
          edit_user_name,
        } = await feishuDocumentFetcher.getDocMeta(docToken);

        const { content } = await feishuDocumentFetcher.getDocContent(docToken);
        const { data: postFrontmatter } = parseDocument(JSON.parse(content));

        return {
          slug:
            ((`${docToken}-` + postFrontmatter.slug) as string) ||
            pinyin(postTitle, { toneType: "none" }).replace(/\s*/g, "-"),
          docToken,
          postTitle,
          createdAt: format(new Date(create_time * 1000), "yyyy-MM-dd"),
        };
      })
      .filter((item) => !!item)
  )) as unknown as HomeProps["posts"];

  return { props: { siteTitle, posts } };
};

export default Home;
