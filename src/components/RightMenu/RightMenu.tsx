import IconButton from "~/components/IconButton";
import { For } from "solid-js";

import Item from "./Item";
import useRightMenu from "~/hooks/useRightMenu";
import RightMenuItem from "./RightMenuItem";
import { styleRightMenu } from "./style.css";

type Props = {
  items: Item[];
  top: number;
  left: number;
};

/** show on right click */
const RightMenu = (props: Props) => {
  return (
    <div
      class={styleRightMenu}
      style={{
        visibility: props.items.length !== 0 ? "visible" : "hidden",
        top: Math.trunc(props.top) + "px",
        left: Math.trunc(props.left) + "px",
      }}>
      <IconButton icon="close" onClick={useRightMenu()([])} />
      <hr></hr>
      <For each={props.items}>{item => <RightMenuItem item={item} />}</For>
    </div>
  );
};

export default RightMenu;
