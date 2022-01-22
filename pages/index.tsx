import type { NextPage, GetServerSideProps } from "next";

import { feishuDocumentFetcher } from "../utils/feishu";

interface HomeProps {
  folderChildren: any;
}

const Home: NextPage<HomeProps> = ({ folderChildren }) => {
  return (
    <div>
      <pre>{JSON.stringify(folderChildren, null, 2)}</pre>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  const folderChildren = await feishuDocumentFetcher.getFolderChildren("fldcne3Qc7mpOsjT0D7mbH5p8nb");
  return { props: { folderChildren } };
};

export default Home;
