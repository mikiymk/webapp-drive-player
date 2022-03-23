import IconButton from "components/IconButton";
import React from "react";
import { css } from "@linaria/core";

import Item from "./Item";
import useRightMenu from "hooks/useRightMenu";
import RightMenuItem from "./RightMenuItem";

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
      {items.map((item, index) => (
        <RightMenuItem item={item} key={item.type + index} />
      ))}
    </div>
  );
};

export default RightMenu;
