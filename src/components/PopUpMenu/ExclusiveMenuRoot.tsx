import { onCleanup, onMount, useContext } from "solid-js";

import { ExclusiveContext } from "./ExclusiveContext";

import type { JSXElement } from "solid-js";

export interface ExclusiveMenuRootProps {
  children: JSXElement;
}

export const ExclusiveMenuRoot = (props: ExclusiveMenuRootProps) => {
  const { apply, remove, close } = useContext(ExclusiveContext);
  const closeMenus = new Set<() => void>();

  const collectCloseMenu = (closeMenu: () => void) => {
    closeMenus.add(closeMenu);
  };

  const dropCloseMenu = (closeMenu: () => void) => {
    closeMenus.delete(closeMenu);
  };

  const closeMenu = () => {
    closeMenus.forEach((close) => close());
    close();
  };

  onMount(() => {
    apply(closeMenu);
  });

  onCleanup(() => {
    remove(closeMenu);
  });

  return (
    <ExclusiveContext.Provider
      value={{
        apply: collectCloseMenu,
        remove: dropCloseMenu,
        close: closeMenu,
      }}
    >
      {props.children}
    </ExclusiveContext.Provider>
  );
};
