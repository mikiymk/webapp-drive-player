import React from "react";
import { style, styleInner } from "./style";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** CSSで横に動く */
const Marquee: React.FC<Props> = ({ children, className }) => {
  let classes = `${style}`;
  if (className !== undefined) {
    classes = `${style} ${className}`;
  }

  return (
    <span className={classes}>
      <span className={styleInner}>{children}</span>
    </span>
  );
};

export default Marquee;
