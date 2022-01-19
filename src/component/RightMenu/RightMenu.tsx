import React from "react";

import Item from "./Item";

type Props = {
  items: Item[];
  top: number;
  left: number;
};

/** show on right click */
const RightMenu: React.FC<Props> = ({ items, top, left }) => {
  return (
    <div
      className="right-menu"
      style={{
        visibility: items.length !== 0 ? "visible" : "hidden",
        top: `${Math.trunc(top)}px`,
        left: `${Math.trunc(left)}px`,
      }}>
      {items.map((item, index) => {
        if (item.type === "hr") {
          return <hr key={`h-${index}`}></hr>;
        } else if (item.type === "button") {
          return (
            <button key={`b-${item.label}`} onClick={item.onClick}>
              {item.label}
            </button>
          );
        } else if (item.type === "anchor") {
          return (
            <a
              key={`a-${item.label}`}
              href={item.href}
              target="_blank"
              rel="noreferrer">
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
