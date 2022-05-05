import IconButton from "~/components/IconButton";
import { For, useContext } from "solid-js";

import type Item from "./Item";
import RightMenuItem from "./RightMenuItem";
import { styleRightMenu } from "./style.css";
import { Context } from ".";

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
      <IconButton icon="close" onClick={[useContext(Context), []]} />
      <hr></hr>
      <For each={props.items}>{item => <RightMenuItem item={item} />}</For>
    </div>
  );
};

export default RightMenu;
