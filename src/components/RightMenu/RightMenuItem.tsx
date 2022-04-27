import { For, Match, Switch } from "solid-js";

import Item from "./Item";
import { styleHorizon, styleItem } from "./style.css";

type Props = {
  item: Item;
};

/** show on right click */
const RightMenuItem = (props: Props) => {
  return (
    <Switch>
      <Match when={props.item.type === "hr" && props.item}>
        <hr className={styleHorizon}></hr>
      </Match>
      <Match when={props.item.type === "button" && props.item}>
        {({ onClick, label }) => (
          <button className={styleItem} onClick={onClick}>
            {label}
          </button>
        )}
      </Match>
      <Match when={props.item.type === "anchor" && props.item}>
        {({ href, label }) => (
          <a className={styleItem} href={href} target="_blank" rel="noreferrer">
            {label}
          </a>
        )}
      </Match>
      <Match when={props.item.type === "list" && props.item}>
        {({ list, label }) => (
          <div className={styleItem}>
            {label}
            <For each={list}>{item => <RightMenuItem item={item} />}</For>
          </div>
        )}
      </Match>
    </Switch>
  );
};

export default RightMenuItem;
