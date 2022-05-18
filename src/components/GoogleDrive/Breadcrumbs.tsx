import { For, Show } from "solid-js";

import type { GoogleFile } from "~/file";

import { styleBread, styleBreadcrumbs } from "./style.css";

export type BreadcrumbsProps = {
  parents: GoogleFile[];
  move: (index: number) => void;
};

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  return (
    <ul class={styleBreadcrumbs}>
      <For each={props.parents}>
        {(parent, index) => (
          <>
            <Show when={index() !== 0}>{" > "}</Show>
            <Bread parent={parent} move={() => props.move(index())} />
          </>
        )}
      </For>
    </ul>
  );
};

type BreadProps = {
  parent: GoogleFile;
  move: () => void;
};

const Bread = (props: BreadProps) => {
  return (
    <li class={styleBread} onClick={() => props.move()}>
      {props.parent.name}
    </li>
  );
};
