import IconButton from "../Common/IconButton";
import React from "react";

type Props = {
  loop: "no" | "one" | "all";
  setLoop: (loop: "no" | "one" | "all") => void;
};

const LoopButton: React.FC<Props> = ({ loop, setLoop }) => {
  const onClick = () => setLoop(toggleLoop(loop));

  return <IconButton icon={googleIcon[loop]} onClick={onClick} />;
};

const googleIcon = {
  no: "repeat",
  one: "repeat_one_on",
  all: "repeat_on",
};

const toggleLoop = (loop: "no" | "one" | "all") => {
  if (loop === "no") {
    return "all";
  } else if (loop === "all") {
    return "one";
  } else if (loop === "one") {
    return "no";
  }
  return "no";
};

export default LoopButton;
