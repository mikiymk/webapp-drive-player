import type { JSX } from "solid-js";

import Icon from "~/components/GoogleIcon";
import { styleIcon } from "./style.css";

type Props = {
  icon: string;
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  class?: string;
};

/** Google Material Icon ボタン */
const IconButton = (props: Props) => {
  const classes = () =>
    props.class ? `${styleIcon} ${props.class}` : styleIcon;

  return (
    <button onClick={props.onClick} class={classes()}>
      <Icon icon={props.icon} class={`${styleIcon}-icon`} />
    </button>
  );
};

export default IconButton;
