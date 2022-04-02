import React, { memo } from "react";

import Repeat from "audio/repeat";
import IconButton from "components/IconButton";

import { styleIcon } from "./style";

type Props = {
  repeat: Repeat;
  toggleRepeat: () => void;
};

const iconName = {
  "repeat off": "repeat",
  "repeat one": "repeat_one_on",
  "repeat on": "repeat_on",
} as const;

const RepeatButton: React.FC<Props> = memo(({ repeat, toggleRepeat }) => {
  return (
    <IconButton
      icon={iconName[repeat.value]}
      onClick={toggleRepeat}
      className={styleIcon}
    />
  );
});

export default RepeatButton;
