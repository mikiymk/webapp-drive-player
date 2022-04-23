import React, { useState } from "react";
import Item from "~/components/RightMenu/Item";
import RightMenu from "~/components/RightMenu/RightMenu";

const useRightMenuContext = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const setRightMenu = (items: Item[]) => (event: React.MouseEvent) => {
    setItems(items);
    setTop(event.clientY);
    setLeft(event.clientX);
  };

  const RightMenuComponent = <RightMenu items={items} top={top} left={left} />;

  return {
    value: { setRightMenu },
    RightMenu: RightMenuComponent,
  };
};

export default useRightMenuContext;
