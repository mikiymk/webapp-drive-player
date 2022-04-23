import React from "react";

import IconButton from "~/components/IconButton";

import { styleIcon } from "./style.css";

type Props = {
  next: () => void;
};

const NextButton: React.FC<Props> = ({ next }) => {
  return <IconButton icon="skip_next" onClick={next} className={styleIcon} />;
};

export default NextButton;
