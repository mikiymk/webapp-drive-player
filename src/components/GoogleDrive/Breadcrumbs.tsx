import { For, Show } from "solid-js";

import { File } from "~/file";
import { styleBread, styleBreadcrumbs } from "./style.css";

type Props = {
  parents: File[];
  move: (index: number) => void;
};

export const Breadcrumbs = (props: Props) => {
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

type PropsBread = {
  parent: File;
  move: () => void;
};

const Bread = (props: PropsBread) => {
  return (
    <li class={styleBread} onClick={props.move}>
      {props.parent.name}
    </li>
  );
};
