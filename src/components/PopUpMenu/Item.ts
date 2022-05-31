import type { JSX } from "solid-js";

type HrItem = { type: "hr" };
type ButtonItem = {
  type: "button";
  label: string;
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
};
type AnchorItem = { type: "anchor"; label: string; href: string };
type ListItem = { type: "list"; label: string; list: Item[] };
type Item = HrItem | ButtonItem | AnchorItem | ListItem;

export default Item;
