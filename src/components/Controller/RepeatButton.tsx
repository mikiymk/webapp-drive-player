import React from "react";

import Repeat from "~/audio/Repeat";
import IconButton from "~/components/IconButton";

import { styleIcon } from "./style.css";

type Props = {
  repeat: Repeat;
  toggleRepeat: () => void;
};

const iconName = {
  "repeat off": "repeat",
  "repeat one": "repeat_one_on",
  "repeat on": "repeat_on",
} as const;

const RepeatButton = (props: Props) => {
  return (
    <IconButton
      icon={iconName[props.repeat.value]}
      onClick={props.toggleRepeat}
      className={styleIcon}
    />
  );
};

export default RepeatButton;
