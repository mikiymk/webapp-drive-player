import React from "react";

import LabelIcon from "~/components/LabelIcon";
import { styleButton } from "./style.css";
import { JSX } from "solid-js";

type Props = {
  icon: string;
  text: string;
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  className?: string;
};

/** Google Material Icon テキスト付きボタン */
const LabelIconButton = (props: Props) => {
  let classes = `${styleButton}`;
  if (props.className !== undefined) {
    classes = `${styleButton} ${props.className}`;
  }
  return (
    <button onClick={props.onClick} className={classes}>
      <LabelIcon icon={props.icon} text={props.text} />
    </button>
  );
};

export default LabelIconButton;
