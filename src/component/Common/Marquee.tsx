import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const Marquee: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={"common-marquee " + (className ?? "")}>
      <div className={"common-marquee-inner"}>{children}</div>
    </div>
  );
};

export default Marquee;
