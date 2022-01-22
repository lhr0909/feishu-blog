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
        <title>
          {folderMeta.name}
        </title>
      </Head>
      <Container>
        {Object.keys(folderChildren.children).map((key: any) => {
          const folder = folderChildren.children[key];
          return (
            <div key={key}>
              <Link href={`/doc/${folder.token}`}><h3>{folder.name}</h3></Link>
            </div>
          );
        })}
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  const folderToken = "fldcne3Qc7mpOsjT0D7mbH5p8nb";
  const folderMeta = await feishuDocumentFetcher.getFolderMeta(folderToken);
  const folderChildren = await feishuDocumentFetcher.getFolderChildren(folderToken);
  return { props: { folderMeta, folderChildren } };
};

export default Home;
