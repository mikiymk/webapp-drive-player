import React from "react";

type Props = {
  loop: "no" | "one" | "all";
  setLoop: (loop: "no" | "one" | "all") => void;
};

const ToggleLoop: React.FC<Props> = ({ loop, setLoop }) => {
  const onClick = () => setLoop(toggleLoop(loop));

  return (
    <>
      Loop:
      <button onClick={onClick}>{loop}</button>
    </>
  );
};

const toggleLoop = (loop: "no" | "one" | "all") => {
  if (loop === "no") {
    return "one";
  } else if (loop === "one") {
    return "all";
  } else if (loop === "all") {
    return "no";
  }
  return "one";
};

export default ToggleLoop;
