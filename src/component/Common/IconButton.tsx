import React from "react";

import Icon from "./Icon";

type Props = {
  icon: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const IconButton: React.FC<Props> = ({ icon, onClick }) => {
  return (
    <button onClick={onClick}>
      <Icon icon={icon} />
    </button>
  );
};

export default IconButton;
