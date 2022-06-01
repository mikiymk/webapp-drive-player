import { useContext } from "solid-js";
import { MenuContext } from "./MenuContext";

export const usePopMenu = () => {
  return useContext(MenuContext).popMenu;
};
