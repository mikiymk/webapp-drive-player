import { styleMarquee, styleInner } from "./style.css";
import type { JSX } from "solid-js";

type Props = {
  children: JSX.Element;
  class?: string;
};

/** CSSで横に動く */
const Marquee = (props: Props) => {
  const classes = () =>
    props.class ? `${styleMarquee} ${props.class}` : styleMarquee;

  return (
    <span class={classes()}>
      <span class={styleInner}>{props.children}</span>
    </span>
  );
};

export default Marquee;
