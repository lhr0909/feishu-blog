import Link from "next/link";
import React from "react";

export const Footer: React.FC<{}> = () => {
  return (
    <div className="text-gray-500 font-extralight py-12">
      Copyright (c) 2022{" "}
      <Link href="https://github.com/lhr0909" passHref>
        <a className="text-blue-500 hover:underline">Simon Liang</a>
      </Link>
    </div>
  );
};
