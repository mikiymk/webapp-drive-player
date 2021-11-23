import React from "react";

const Icon: React.FC<{
  id: string;
}> = ({ id }) => <span className="material-icons-sharp">{id}</span>;

export default Icon;
