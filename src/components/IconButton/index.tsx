import React from "react";

import Icon from "~/components/GoogleIcon";
import { styleIcon } from "./style.css";

type Props = {
  icon: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

/** Google Material Icon ボタン */
const IconButton: React.FC<Props> = ({ icon, onClick, className }) => {
  let classes = `${styleIcon}`;
  if (className !== undefined) {
    classes = `${styleIcon} ${className}`;
  }

  return (
    <button onClick={onClick} className={classes}>
      <Icon icon={icon} className={`${styleIcon}-icon`} />
    </button>
  );
};

export default IconButton;
