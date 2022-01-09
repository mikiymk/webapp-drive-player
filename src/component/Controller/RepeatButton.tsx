import React from "react";

import IconButton from "component/Common/IconButton";

import Repeat from "audio/repeat";

type Props = {
  repeat: Repeat;
  setRepeat: (repeat: Repeat) => void;
};

/** `Repeat` からアイコンへ */
const RepeatButton: React.FC<Props> = ({ repeat, setRepeat }) => {
  const onClick = () => setRepeat(repeat.toggle());

  return <IconButton icon={googleIcon[repeat.value]} onClick={onClick} />;
};

const googleIcon = {
  "repeat off": "repeat",
  "repeat one": "repeat_one_on",
  "repeat on": "repeat_on",
};

export default RepeatButton;
