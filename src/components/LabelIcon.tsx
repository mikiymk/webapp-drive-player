import React from "react";
import { css } from "@linaria/core";

import Icon from "components/GoogleIcon";

const style = css`
  vertical-align: bottom;

  &-label {
    margin-left: 0.5em;
  }
`;

type Props = {
  icon: string;
  text: string;
};

/** Google Material Icon テキスト付き */
const LabelIcon: React.FC<Props> = ({ icon, text }) => {
  return (
    <span>
      <Icon icon={icon} className={style} />
      <span className={`${style} ${style}-label`}>{text}</span>
    </span>
  );
};

export default LabelIcon;
