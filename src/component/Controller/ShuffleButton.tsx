import React from "react";

import IconButton from "component/Common/IconButton";

type Props = {
  shuffle: boolean;
  setShuffle: (shuffle: boolean) => void;
};

const ShuffleButton: React.FC<Props> = ({ shuffle, setShuffle }) => {
  const onClick = () => setShuffle(!shuffle);
  const icon = shuffle ? "shuffle_on" : "shuffle";

  return <IconButton icon={icon} onClick={onClick} />;
};

export default ShuffleButton;
