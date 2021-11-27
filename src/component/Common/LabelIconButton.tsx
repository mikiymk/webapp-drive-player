import React from "react";

import LabelIcon from "./LabelIcon";

type Props = {
  icon: string;
  text: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const LabelIconButton: React.FC<Props> = ({
  icon,
  text,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={"common-label-icon-button " + (className ?? "")}>
      <LabelIcon icon={icon} text={text} />
    </button>
  );
};

export default LabelIconButton;
