import React from "react";

import Icon from "component/Common/Icon";

type Props = {
  icon: string;
  text: string;
  className?: string;
};

const LabelIcon: React.FC<Props> = ({ icon, text, className }) => {
  return (
    <span className={"common-label-icon " + (className ?? "")}>
      <Icon icon={icon} />
      <span className="common-label-icon-label">{text}</span>
    </span>
  );
};

export default LabelIcon;
