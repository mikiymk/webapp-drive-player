import React from "react";
import { style } from "./style";

type Props = {
  icon: string;
  className?: string;
};

/** Google Material Icon */
const Icon: React.FC<Props> = ({ icon, className }) => {
  let classes = `material-icons-sharp ${style}`;
  if (className !== undefined) {
    classes = `material-icons-sharp ${style} ${className}`;
  }

  return <span className={classes}>{icon}</span>;
};

export default Icon;
