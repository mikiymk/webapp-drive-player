type HrItem = { type: "hr" };
type ButtonItem = {
  type: "button";
  label: string;
  onClick: (event: React.MouseEvent) => void;
};
type AnchorItem = { type: "anchor"; label: string; href: string };
type ListItem = { type: "list"; label: string; list: Item[] };
type Item = HrItem | ButtonItem | AnchorItem | ListItem;

export default Item;
