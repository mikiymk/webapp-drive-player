import { createSignal, JSXElement, Match, Switch } from "solid-js";

import { IconLoading, IconDone, IconError } from "~/components/Icon";

import { styleDownload } from "./style.css";

type Status = "loading" | "done" | "error";

type LoadProps = {
  load: () => Promise<void>;
  children: JSXElement;
};

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
      .catch((e: Error) => {
        setStatus("error");
        setMessage(e.message);
      });
  };

  return (
    <div class={styleDownload}>
      <button onClick={onclick}>{props.children}</button>
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
