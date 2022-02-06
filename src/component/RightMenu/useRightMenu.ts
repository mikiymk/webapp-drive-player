import { useContext } from "react";
import Context from "./Context";
import Item from "./Item";

const useRightMenu = (items: Item[]) => {
  return useContext(Context)(items);
};

export default useRightMenu;
