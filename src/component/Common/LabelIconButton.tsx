import React from "react";

import Icon from "./Icon";

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
      className={"common-label-icon-button " + className}>
      <Icon icon={icon} />
      <span className="common-label-icon-button-label">{text}</span>
    </button>
  );
};

export default LabelIconButton;
