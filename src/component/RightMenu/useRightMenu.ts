import { useContext } from "react";
import Context from "./Context";

const useRightMenu = () => {
  return useContext(Context);
};

export default useRightMenu;
