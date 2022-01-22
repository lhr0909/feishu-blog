import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { feishuDocumentFetcher } from "../utils/feishu";

import { Container } from "../components/Container";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

interface HomeProps {
  folderMeta: any;
  folderChildren: any;
}

const Home: NextPage<HomeProps> = ({ folderMeta, folderChildren }) => {
  return (
    <>
      <Head>
        <title>{folderMeta.name}</title>
      </Head>
      <Container>
        <Header title={folderMeta.name} />
        {Object.keys(folderChildren.children).map((key: any) => {
          const folder = folderChildren.children[key];
          return (
            <h3 key={key}>
              <Link href={`/doc/${folder.token}`} passHref>
                <a className="text-blue-500 text-lg">
                  {folder.name}
                </a>
              </Link>
            </h3>
          );
        })}
        <Footer />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const folderToken = process.env.FOLDER_TOKEN!;
  const folderMeta = await feishuDocumentFetcher.getFolderMeta(folderToken);
  const folderChildren = await feishuDocumentFetcher.getFolderChildren(
    folderToken
  );
  return { props: { folderMeta, folderChildren } };
};

export default Home;
