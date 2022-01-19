import React from "react";

type HrItem = { type: "hr" };
type ButtonItem = { type: "button"; label: string; onClick: () => void };
type AnchorItem = { type: "anchor"; label: string; href: string };
type Item = HrItem | ButtonItem | AnchorItem;

type Props = {
  items: Item[];
  x: number;
  y: number;
};

/** show on right click */
const RightMenu: React.FC<Props> = ({ items, x, y }) => {
  return (
    <div
      className="right-menu"
      style={{ top: `${Math.trunc(x)}px`, left: `${Math.trunc(y)}px` }}>
      {items.map(item => {
        if (item.type === "hr") {
          return <hr></hr>;
        } else if (item.type === "button") {
          return <button onClick={item.onClick}>{item.label}</button>;
        } else if (item.type === "anchor") {
          return (
            <a href={item.href} target="_blank">
              {item.label}
            </a>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default RightMenu;
