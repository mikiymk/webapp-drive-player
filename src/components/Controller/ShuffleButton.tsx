import IconButton from "~/components/IconButton";

import { styleIcon } from "./style.css";

type Props = {
  isShuffled: boolean;
  toggleShuffle: () => void;
};

const ShuffleButton = (props: Props) => {
  return (
    <IconButton
      icon={props.isShuffled ? "shuffle_on" : "shuffle"}
      onClick={() => props.toggleShuffle()}
      class={styleIcon}
    />
  );
};

export default ShuffleButton;
