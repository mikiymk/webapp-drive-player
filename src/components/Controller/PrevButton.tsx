import React from "react";

import IconButton from "components/IconButton";

import { styleIcon } from "./style.css";

type Props = {
  prev: () => void;
};

const PrevButton: React.FC<Props> = ({ prev }) => {
  return (
    <IconButton icon="skip_previous" onClick={prev} className={styleIcon} />
  );
};

export default PrevButton;
