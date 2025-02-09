import { Match, Switch, createSignal } from "solid-js";

import { IconDone, IconError, IconLoading } from "~/components/Icon";

import { download } from "./style.css";

import type { JSXElement } from "solid-js";

type Status = "loading" | "done" | "error";

interface LoadProps {
  load: () => Promise<void>;
  children: JSXElement;
}

/**
 * now playing audio info view
 */
export const Load = (props: LoadProps) => {
  const [status, setStatus] = createSignal<Status>();
  const [message, setMessage] = createSignal<string>();

  const onclick = () => {
    setStatus("loading");
    props
      .load()
      .then(() => setStatus("done"))
      .catch((e: unknown) => {
        setStatus("error");
        setMessage((e as Error).message);
      });
  };

  return (
    <div class={download}>
      <button type="button" onClick={onclick}>
        {props.children}
      </button>
      <Switch>
        <Match when={status() === "loading"}>
          <IconLoading />
        </Match>
        <Match when={status() === "done"}>
          <IconDone />
        </Match>
        <Match when={status() === "error"}>
          <IconError />
          {message()}
        </Match>
      </Switch>
    </div>
  );
};
