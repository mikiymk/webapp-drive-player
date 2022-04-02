import React, { memo } from "react";

import IconButton from "components/IconButton";

import { styleIcon } from "./style";

type Props = {
  isShuffled: boolean;
  toggleShuffle: () => void;
};

const ShuffleButton: React.FC<Props> = memo(({ isShuffled, toggleShuffle }) => {
  const icon = isShuffled ? "shuffle_on" : "shuffle";
  return (
    <IconButton icon={icon} onClick={toggleShuffle} className={styleIcon} />
  );
});

export default ShuffleButton;
