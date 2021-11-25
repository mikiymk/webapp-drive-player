import React from "react";

type Props = {
  icon: string;
};

const Icon: React.FC<Props> = ({ icon }) => {
  return <span className="material-icons-sharp">{icon}</span>;
};

export default Icon;
