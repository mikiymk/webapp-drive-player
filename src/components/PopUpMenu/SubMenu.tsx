import { Show, createEffect, createSignal } from "solid-js";

import { createRef } from "~/hooks/createRef";

import { styleItem, styleSubMenu } from "./style.css";

import type { JSXElement } from "solid-js";

export type SubMenuProps = {
  label: string;
  children: JSXElement;
};

/** show on right click */
export const SubMenu = (props: SubMenuProps) => {
  const [current, ref] = createRef<HTMLDivElement>();
  const [visible, setVisible] = createSignal(false);
  const [maxHeight, setMaxHeight] = createSignal("0");
  const [maxWidth, setMaxWidth] = createSignal("0");

  createEffect(() => {
    visible();
    const rect = current()?.getBoundingClientRect();
    if (rect) {
      setMaxHeight(window.innerHeight - rect.top + "px");
      setMaxWidth(window.innerWidth - rect.left + "px");
    }
  });

  return (
    <div class={styleItem}>
      <button onClick={() => setVisible((v) => !v)}>{props.label}</button>
      <Show when={visible()}>
        <div
          class={styleSubMenu}
          style={{
            "max-height": maxHeight(),
            "max-width": maxWidth(),
          }}
          ref={ref}
        >
          {props.children}
        </div>
      </Show>
    </div>
  );
};
