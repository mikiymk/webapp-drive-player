import React from "react";

type Props = {
  icon: string;
  className?: string;
};

const Icon: React.FC<Props> = ({ icon, className }) => {
  return (
    <span className={"common-icon " + (className ?? "")}>
      <span className={"material-icons-sharp"}>{icon}</span>
    </span>
  );
};

export default Icon;
