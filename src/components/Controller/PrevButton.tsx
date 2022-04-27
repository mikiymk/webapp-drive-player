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
      class={styleIcon}
    />
  );
};

export default PrevButton;
