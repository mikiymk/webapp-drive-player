import React from "react";
import { css } from "@linaria/core";

import Icon from "component/Common/Icon";

const style = css`
  vertical-align: middle;
`;

type Props = {
  icon: string;
  text: string;
};

/** Google Material Icon テキスト付き */
const LabelIcon: React.FC<Props> = ({ icon, text }) => {
  return (
    <span className={style}>
      <Icon icon={icon} />
      {text}
    </span>
  );
};

export default LabelIcon;
