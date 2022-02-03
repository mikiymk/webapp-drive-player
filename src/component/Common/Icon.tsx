import React from "react";
import { css } from "@linaria/core";

const style = css`
  font-size: 1rem;
  height: 1rem;
  width: 1rem;

  padding: 0rem 1rem;

  display: flex;
  justify-content: center;
  align-items: center;

  & span {
    font-size: inherit;
  }
`;

type Props = {
  icon: string;
  className?: string;
};

/** Google Material Icon */
const Icon: React.FC<Props> = ({ icon }) => {
  return (
    <span className={style}>
      <span className={"material-icons-sharp"}>{icon}</span>
    </span>
  );
};

export default Icon;
