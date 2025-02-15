import { For, Show } from "solid-js";

import { bread, breadcrumbs } from "./style.css";

import type { GoogleFile } from "~/api/google/type";

interface BreadcrumbsProps {
  parents: GoogleFile[];
  move: (index: number) => void;
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  return (
    <ul class={breadcrumbs}>
      <For each={props.parents}>
        {(parent, index) => (
          <>
            <Show when={index() !== 0}>
              <li>{" > "}</li>
            </Show>
            <Bread
              parent={parent}
              move={() => {
                props.move(index());
              }}
            />
          </>
        )}
      </For>
    </ul>
  );
};

interface BreadProps {
  parent: GoogleFile;
  move: () => void;
}

const Bread = (props: BreadProps) => {
  return (
    <li
      class={bread}
      onClick={() => {
        props.move();
      }}
      onKeyPress={() => {
        props.move();
      }}
    >
      {props.parent.name}
    </li>
  );
};
