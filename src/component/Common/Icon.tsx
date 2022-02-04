import React from "react";
import { css } from "@linaria/core";

const style = css`
  font-size: inherit;
  color: inherit;
`;

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
