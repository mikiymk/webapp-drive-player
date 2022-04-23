import React from "react";

import Icon from "~/components/GoogleIcon";
import { styleIcon, styleLabel } from "./style.css";

type Props = {
  icon: string;
  text: string;
};

/** Google Material Icon テキスト付き */
const LabelIcon: React.FC<Props> = ({ icon, text }) => {
  return (
    <span>
      <Icon icon={icon} className={styleIcon} />
      <span className={`${styleIcon} ${styleLabel}`}>{text}</span>
    </span>
  );
};

export default LabelIcon;
