import IconButton from "~/components/IconButton";

import { styleIcon } from "./style.css";

type Props = {
  next: () => void;
};

const NextButton = (props: Props) => {
  return (
    <IconButton icon="skip_next" onClick={props.next} class={styleIcon} />
  );
};

export default NextButton;
