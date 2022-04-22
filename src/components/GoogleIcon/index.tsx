import React from "react";
import { styleIcon } from "./style.css";

type Props = {
  icon: string;
  className?: string;
};

/** Google Material Icon */
const Icon: React.FC<Props> = ({ icon, className }) => {
  let classes = `material-icons-sharp ${styleIcon}`;
  if (className !== undefined) {
    classes = `material-icons-sharp ${styleIcon} ${className}`;
  }

  return <span className={classes}>{icon}</span>;
};

export default Icon;
