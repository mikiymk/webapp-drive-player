import { styleMarquee, styleInner } from "./style.css";
import { JSX } from "solid-js";

type Props = {
  children: JSX.Element;
  class?: string;
};

/** CSSで横に動く */
const Marquee = (props: Props) => {
  let classes = `${styleMarquee}`;
  if (props.class !== undefined) {
    classes = `${styleMarquee} ${props.class}`;
  }

  return (
    <span class={classes}>
      <span class={styleInner}>{props.children}</span>
    </span>
  );
};

export default Marquee;
