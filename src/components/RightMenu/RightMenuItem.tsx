import React from "react";

import Item from "./Item";
import { styleHorizon, styleItem } from "./style";

type Props = {
  item: Item;
};

/** show on right click */
const RightMenuItem: React.FC<Props> = ({ item }) => {
  if (item.type === "hr") {
    return <hr className={styleHorizon}></hr>;
  } else if (item.type === "button") {
    return (
      <button className={styleItem} onClick={item.onClick}>
        {item.label}
      </button>
    );
  } else if (item.type === "anchor") {
    return (
      <a
        className={styleItem}
        href={item.href}
        target="_blank"
        rel="noreferrer">
        {item.label}
      </a>
    );
  } else if (item.type === "list") {
    return (
      <div className={styleItem}>
        {item.label}
        <div className="inner-list">
          {item.list.map((item, index) => (
            <RightMenuItem item={item} key={item.type + index} />
          ))}
        </div>
      </div>
    );
  } else {
    const neverItem: never = item;
    console.log("never item", neverItem);
    return null;
  }
};

export default RightMenuItem;
