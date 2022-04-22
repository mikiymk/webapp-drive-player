import IconButton from "components/IconButton";
import React from "react";

import Item from "./Item";
import useRightMenu from "hooks/useRightMenu";
import RightMenuItem from "./RightMenuItem";
import { styleRightMenu } from "./style.css";

type Props = {
  items: Item[];
  top: number;
  left: number;
};

/** show on right click */
const RightMenu: React.FC<Props> = ({ items, top, left }) => {
  return (
    <div
      className={styleRightMenu}
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
