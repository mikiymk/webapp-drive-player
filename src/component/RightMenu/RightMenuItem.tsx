import React from "react";
import { css } from "@linaria/core";

import Item from "./Item";

const style = css`
  margin: 0.5rem;
`;

const styleHr = css`
  margin: 0.2rem;
`;

type Props = {
  item: Item;
};

/** show on right click */
const RightMenuItem: React.FC<Props> = ({ item }) => {
  if (item.type === "hr") {
    return <hr className={styleHr}></hr>;
  } else if (item.type === "button") {
    return (
      <button className={style} onClick={item.onClick}>
        {item.label}
      </button>
    );
  } else if (item.type === "anchor") {
    return (
      <a className={style} href={item.href} target="_blank" rel="noreferrer">
        {item.label}
      </a>
    );
  } else if (item.type === "list") {
    return (
      <div className={style}>
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
