import { createSignal, JSXElement } from "solid-js";

import { MenuContext } from "./MenuContext";

export type MenuProviderProps = {
  menu: JSXElement;
  children: JSXElement;
};

export const MenuProvider = (props: MenuProviderProps) => {
  const [visible, setVisible] = createSignal(false);
  const [top, setTop] = createSignal(0);
  const [left, setLeft] = createSignal(0);

  const popMenu = (event: MouseEvent) => {
    console.log("pop");
    setVisible(true);
    setTop(event.clientY);
    setLeft(event.clientX);
  };

  const closeMenu = () => {
    setVisible(false);
  };

  return (
    <MenuContext.Provider value={{ top, left, visible, popMenu, closeMenu }}>
      {props.children}
      {props.menu}
    </MenuContext.Provider>
  );
};
