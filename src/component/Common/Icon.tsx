import React from "react";

const Icon: React.FC<{
  id: string;
}> = ({ id }) => {
  return <span className="material-icons-sharp">{id}</span>;
};

export default Icon;
