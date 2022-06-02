import { createSignal, Match, Switch } from "solid-js";

import {
  IconDone,
  IconError,
  IconLoading,
  IconUpload,
} from "~/components/Icon";
import { sendLibrary } from "~/google/fetchLibrary";
import { audios } from "~/hooks/createAudios";
import { accessToken } from "~/hooks/useSignIn";

import { styleUpload } from "./style.css";

/**
 * now playing audio info view
 */
export const Upload = () => {
  const [status, setStatus] = createSignal("");
  const upload = async () => {
    setStatus("loading");
    const token = accessToken();
    if (token === undefined) return;
    const response = await sendLibrary(token, Array.from(audios().entries()));
    setStatus(response.status === 200 ? "done" : "error");
  };

  return (
    <div class={styleUpload}>
      <button onClick={upload}>
        <IconUpload />
        send library data to google drive
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
        </Match>
      </Switch>
    </div>
  );
};
