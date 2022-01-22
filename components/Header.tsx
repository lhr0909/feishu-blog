import React from "react";
import Link from "next/link";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <nav className="flex flex-col sm:flex-row sm:justify-between">
      <h1 className="mb-2 sm:mb-8 text-2xl font-medium inline-block">{title}</h1>
      <div className="mb-8 sm:mb-0 inline-block">
        <Link href="/" passHref>
          <a className="text-blue-500">
            博客列表
          </a>
        </Link>
      </div>
    </nav>
  );
};
