import { For, useContext } from "solid-js";

import { IconClose } from "~/components/Icon";
import { createRef } from "~/hooks/createRef";

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
  const [current, ref] = createRef<HTMLDivElement>();

  return (
    <div
      class={styleRightMenu}
      style={{
        visibility: props.items.length !== 0 ? "visible" : "hidden",
        top: getLength(
          props.top,
          current()?.clientHeight ?? 0,
          window.innerHeight
        ),
        left: getLength(
          props.left,
          current()?.clientWidth ?? 0,
          window.innerWidth
        ),
      }}
      ref={ref}>
      <button onclick={[useContext(Context), []]}>
        <IconClose />
      </button>
      <hr></hr>
      <For each={props.items}>{item => <RightMenuItem item={item} />}</For>
    </div>
  );
};

/**
 * クリック位置から右下に出るので、右端や下端でメニューを出すとウインドウの外に出てしまうのを防ぐ
 *
 * @param offset クリック位置座標
 * @param menuSize メニュー要素の大きさ
 * @param winSize ウインドウの大きさ
 * @returns メニュー要素がすべてウインドウに入るような右上の座標
 */
const getLength = (offset: number, menuSize: number, winSize: number) =>
  Math.trunc(offset + menuSize > winSize ? winSize - menuSize : offset) + "px";
