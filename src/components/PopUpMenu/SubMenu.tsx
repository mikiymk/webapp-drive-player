import { createSignal, JSXElement, Show } from "solid-js";

import { styleItem, styleSubMenu } from "./style.css";

export type SubMenuProps = {
  label: string;
  children: JSXElement;
};

/** show on right click */
export const SubMenu = (props: SubMenuProps) => {
  const [visible, setVisible] = createSignal(false);

  return (
    <div class={styleItem}>
      <button onClick={() => setVisible(v => !v)}>{props.label}</button>
      <Show when={visible()}>
        <div class={styleSubMenu}>{props.children}</div>
      </Show>
    </div>
  );
};
