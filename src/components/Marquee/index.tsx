import React from "react";
import { styleMarquee, styleInner } from "./style.css";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/** CSSで横に動く */
const Marquee: React.FC<Props> = ({ children, className }) => {
  let classes = `${styleMarquee}`;
  if (className !== undefined) {
    classes = `${styleMarquee} ${className}`;
  }

  return (
    <span className={classes}>
      <span className={styleInner}>{children}</span>
    </span>
  );
};

export default Marquee;
