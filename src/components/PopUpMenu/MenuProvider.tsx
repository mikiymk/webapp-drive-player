import {
  createSignal,
  JSXElement,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";

import { ExclusiveContext } from "./ExclusiveContext";
import { MenuContext } from "./MenuContext";

export type MenuProviderProps = {
  menu: JSXElement;
  children: JSXElement;
};

export const MenuProvider = (props: MenuProviderProps) => {
  const [visible, setVisible] = createSignal(false);
  const [top, setTop] = createSignal(0);
  const [left, setLeft] = createSignal(0);

  const { apply, remove, close } = useContext(ExclusiveContext);

  const closeMenu = () => {
    setVisible(false);
  };

  onMount(() => {
    apply(closeMenu);
  });

  onCleanup(() => {
    remove(closeMenu);
  });

  const popMenu = (event: MouseEvent) => {
    close();
    setVisible(true);
    setTop(event.clientY);
    setLeft(event.clientX);
  };

  return (
    <MenuContext.Provider value={{ top, left, visible, popMenu, closeMenu }}>
      {props.children}
      {props.menu}
    </MenuContext.Provider>
  );
};
