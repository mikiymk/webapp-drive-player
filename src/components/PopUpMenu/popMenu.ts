import { useContext } from "solid-js";
import { MenuContext } from "./MenuContext";

export const popMenu = (event: MouseEvent) => {
  useContext(MenuContext).popMenu(event);
};
