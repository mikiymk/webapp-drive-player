import type { JSX } from "solid-js";

import Icon from "~/components/GoogleIcon";
import { styleIcon } from "./style.css";

type Props = {
  icon: string;
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  className?: string;
};

/** Google Material Icon ボタン */
const IconButton = (props: Props) => {
  let classes = `${styleIcon}`;
  if (props.className !== undefined) {
    classes = `${styleIcon} ${props.className}`;
  }

  return (
    <button onClick={props.onClick} className={classes}>
      <Icon icon={props.icon} className={`${styleIcon}-icon`} />
    </button>
  );
};

export default IconButton;
