import IconButton from "~/components/IconButton";

import { styleIcon } from "./style.css";

type Props = {
  isShuffled: boolean;
  toggleShuffle: () => void;
};

const ShuffleButton = (props: Props) => {
  const icon = props.isShuffled ? "shuffle_on" : "shuffle";

  return (
    <IconButton
      icon={icon}
      onClick={props.toggleShuffle}
      class={styleIcon}
    />
  );
};

export default ShuffleButton;
