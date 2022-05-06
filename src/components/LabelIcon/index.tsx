import type { JSXElement } from "solid-js";
import { styleLabel } from "./style.css";

type Props = {
  icon: JSXElement;
  children: string;
};

/** Google Material Icon テキスト付き */
const LabelIcon = (props: Props) => {
  return (
    <>
      {props.icon}
      <span class={styleLabel}>{props.children}</span>
    </>
  );
};

export default LabelIcon;
