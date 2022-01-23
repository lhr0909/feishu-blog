import React from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  siteTitle: string;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ siteTitle, children }) => {
  return (
    <div className="container">
      <Header title={siteTitle} />
      {children}
      <Footer />
    </div>
  );
};
