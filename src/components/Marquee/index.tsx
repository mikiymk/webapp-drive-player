import { styleInner, marquee } from "./style.css";

import type { JSX } from "solid-js";

interface MarqueeProps {
  children: JSX.Element;
  class?: string;
}

/** CSSで横に動く */
export const Marquee = (props: MarqueeProps) => {
  return (
    <span class={props.class ? `${marquee} ${props.class}` : marquee}>
      <span class={styleInner}>{props.children}</span>
    </span>
  );
};
