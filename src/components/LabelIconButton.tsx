import React from "react";
import { css } from "@linaria/core";

import LabelIcon from "components/LabelIcon";

const style = css`
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

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
  let classes = `${style}`;
  if (className !== undefined) {
    classes = `${style} ${className}`;
  }
  return (
    <button onClick={onClick} className={classes}>
      <LabelIcon icon={icon} text={text} />
    </button>
  );
};

export default LabelIconButton;
