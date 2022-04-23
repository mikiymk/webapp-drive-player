import React from "react";

import LabelIcon from "~/components/LabelIcon";
import { styleButton } from "./style.css";

type Props = {
  icon: string;
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

/** Google Material Icon テキスト付きボタン */
const LabelIconButton: React.FC<Props> = ({
  icon,
  text,
  onClick,
  className,
}) => {
  let classes = `${styleButton}`;
  if (className !== undefined) {
    classes = `${styleButton} ${className}`;
  }
  return (
    <button onClick={onClick} className={classes}>
      <LabelIcon icon={icon} text={text} />
    </button>
  );
};

export default LabelIconButton;
