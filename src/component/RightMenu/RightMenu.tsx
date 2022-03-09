import IconButton from "component/Common/IconButton";
import React from "react";
import { css } from "@linaria/core";

import Item from "./Item";
import useRightMenu from "./useRightMenu";

const style = css`
  position: fixed;
  visibility: hidden;
  top: 0px;
  left: 0px;

  background-color: white;
  border-color: gray;
  border-style: solid;
  border-width: 0.1rem;

  min-width: 10rem;

  & button,
  & a {
    margin: 0.5rem;
  }

  & hr {
    margin: 0.2rem;
  }
`;

type Props = {
  items: Item[];
  top: number;
  left: number;
};

/** show on right click */
const RightMenu: React.FC<Props> = ({ items, top, left }) => {
  return (
    <div
      className={style}
      style={{
        visibility: items.length !== 0 ? "visible" : "hidden",
        top: `${Math.trunc(top)}px`,
        left: `${Math.trunc(left)}px`,
      }}>
      <IconButton icon="close" onClick={useRightMenu()([])} />
      <hr></hr>
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
