import React from "react";
export const Container: React.FC<{}> = ({ children }) => {
  return (
    <div className="container w-4/5 md:max-w-3xl mx-auto pt-20">
      {children}
    </div>
  );
};
