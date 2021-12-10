import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const Marquee: React.FC<Props> = ({ className, children }) => {
  return (
    <span className={"common-marquee " + (className ?? "")}>
      <span className={"common-marquee-inner"}>{children}</span>
    </span>
  );
};

export default Marquee;
