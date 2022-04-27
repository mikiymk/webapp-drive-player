import React from "react";
import { styleMarquee, styleInner } from "./style.css";
import { JSX } from "solid-js";

type Props = {
  children: JSX.Element;
  className?: string;
};

/** CSSで横に動く */
const Marquee = (props: Props) => {
  let classes = `${styleMarquee}`;
  if (props.className !== undefined) {
    classes = `${styleMarquee} ${props.className}`;
  }

  return (
    <span className={classes}>
      <span className={styleInner}>{props.children}</span>
    </span>
  );
};

export default Marquee;
