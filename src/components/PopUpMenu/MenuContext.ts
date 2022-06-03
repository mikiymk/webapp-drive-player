import { createContext } from "solid-js";

import type { Accessor } from "solid-js";

export type MenuContext = {
  top: Accessor<number>;
  left: Accessor<number>;
  visible: Accessor<boolean>;
  popMenu: (e: MouseEvent) => void;
  closeMenu: () => void;
};

const contextError = () => {
  throw new Error("out of context");
};
export const MenuContext = createContext<MenuContext>({
  top: contextError,
  left: contextError,
  visible: contextError,
  popMenu: contextError,
  closeMenu: contextError,
});
