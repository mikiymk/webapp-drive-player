import React from "react";

import Icon from "component/Common/Icon";

type Props = {
  icon: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

/** Google Material Icon ボタン */
const IconButton: React.FC<Props> = ({ icon, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={"common-icon-button " + (className ?? "")}>
      <Icon icon={icon} /> {/* // TODO span + class で書く */}
    </button>
  );
};

export default IconButton;
