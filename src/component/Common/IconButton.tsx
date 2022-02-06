import React from "react";
import { css } from "@linaria/core";

import Icon from "component/Common/Icon";

const style = css`
  text-align: center;
  vertical-align: middle;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

type Props = {
  icon: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

/** Google Material Icon ボタン */
const IconButton: React.FC<Props> = ({ icon, onClick, className }) => {
  let classes = `${style}`;
  if (className !== undefined) {
    classes = `${style} ${className}`;
  }

  return (
    <button onClick={onClick} className={classes}>
      <Icon icon={icon} className={`${style}-icon`} />
    </button>
  );
};

export default IconButton;
