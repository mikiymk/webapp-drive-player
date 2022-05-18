import { For, useContext } from "solid-js";

import { IconClose } from "~/components/Icon";

import type Item from "./Item";
import { RightMenuItem } from "./RightMenuItem";
import { styleRightMenu } from "./style.css";
import { Context } from ".";

export type RightMenuProps = {
  items: Item[];
  top: number;
  left: number;
};

/** show on right click */
export const RightMenu = (props: RightMenuProps) => {
  return (
    <div
      class={styleRightMenu}
      style={{
        visibility: props.items.length !== 0 ? "visible" : "hidden",
        top: Math.trunc(props.top) + "px",
        left: Math.trunc(props.left) + "px",
      }}>
      <button onclick={[useContext(Context), []]}>
        <IconClose />
      </button>
      <hr></hr>
      <For each={props.items}>{item => <RightMenuItem item={item} />}</For>
    </div>
  );
};
