import React from "react";

import IconButton from "~/components/IconButton";

import { styleIcon } from "./style.css";

type Props = {
  next: () => void;
};

const NextButton = (props: Props) => {
  return (
    <IconButton icon="skip_next" onClick={props.next} className={styleIcon} />
  );
};

export default NextButton;
