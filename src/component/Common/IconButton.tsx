import React from "react";

import Icon from "./Icon";

const IconButton: React.FC<{
  icon: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ icon, onClick }) => {
  return (
    <button onClick={onClick}>
      <Icon id={icon} />
    </button>
  );
};

export default IconButton;
