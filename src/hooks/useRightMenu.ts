import { useContext } from "solid-js";
import Context from "~/components/RightMenu/Context";

const useRightMenu = () => {
  return useContext(Context);
};

export default useRightMenu;
