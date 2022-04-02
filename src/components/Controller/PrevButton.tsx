import React, { memo } from "react";

import IconButton from "components/IconButton";

import { styleIcon } from "./style";

type Props = {
  prev: () => void;
};

const PrevButton: React.FC<Props> = memo(({ prev }) => {
  return (
    <IconButton icon="skip_previous" onClick={prev} className={styleIcon} />
  );
});

export default PrevButton;
