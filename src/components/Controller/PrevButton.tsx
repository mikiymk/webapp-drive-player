import React from "react";

import IconButton from "~/components/IconButton";

import { styleIcon } from "./style.css";

type Props = {
  prev: () => void;
};

const PrevButton = (props: Props) => {
  return (
    <IconButton
      icon="skip_previous"
      onClick={props.prev}
      className={styleIcon}
    />
  );
};

export default PrevButton;
