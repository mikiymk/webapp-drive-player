import { styleInner, styleMarquee } from "./style.css";

import type { JSX } from "solid-js";

export interface MarqueeProps {
  children: JSX.Element;
  class?: string;
}

/** CSSで横に動く */
export const Marquee = (props: MarqueeProps) => {
  const classes = () =>
    props.class ? `${styleMarquee} ${props.class}` : styleMarquee;

  return (
    <span class={classes()}>
      <span class={styleInner}>{props.children}</span>
    </span>
  );
};
