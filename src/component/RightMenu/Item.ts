type HrItem = { type: "hr" };
type ButtonItem = { type: "button"; label: string; onClick: () => void };
type AnchorItem = { type: "anchor"; label: string; href: string };
type Item = HrItem | ButtonItem | AnchorItem;

export default Item;
