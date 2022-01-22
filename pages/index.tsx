import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { feishuDocumentFetcher } from "../utils/feishu";

import { Container } from "../components/Container";

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
        <h1 className="mb-8 text-4xl font-medium">{folderMeta.name}</h1>
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
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const folderToken = "fldcne3Qc7mpOsjT0D7mbH5p8nb";
  const folderMeta = await feishuDocumentFetcher.getFolderMeta(folderToken);
  const folderChildren = await feishuDocumentFetcher.getFolderChildren(
    folderToken
  );
  return { props: { folderMeta, folderChildren } };
};

export default Home;
