import React from "react";
import { Component } from "solid-js";

import Icon from "~/components/GoogleIcon";
import { styleIcon, styleLabel } from "./style.css";

type Props = {
  icon: string;
  text: string;
};

/** Google Material Icon テキスト付き */
const LabelIcon = (props: Props) => {
  return (
    <span>
      <Icon icon={props.icon} className={styleIcon} />
      <span className={`${styleIcon} ${styleLabel}`}>{props.text}</span>
    </span>
  );
};

export default LabelIcon;
