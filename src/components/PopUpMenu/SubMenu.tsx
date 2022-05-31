import { createSignal, JSXElement, useContext } from "solid-js";

import { MenuContext } from "./MenuContext";
import { styleSubMenu } from "./style.css";

export type MenuProps = {
  label: string;
  children: JSXElement;
};

/** show on right click */
export const SubMenu = (props: MenuProps) => {
  const [visible, setVisible] = createSignal(false);
  const { visible: pvisible } = useContext(MenuContext);

  return (
    <div>
      <div onClick={() => setVisible(v => !v)}>{props.label}</div>
      <div
        class={styleSubMenu}
        style={{
          visibility: pvisible() && visible() ? "visible" : "hidden",
        }}>
        {props.children}
      </div>
    </div>
  );
};
