import { createSignal, Match, Switch } from "solid-js";

import { downloadLibraryData } from "~/file";
import { addAudios } from "~/hooks/createAudios";
import {
  IconLoading,
  IconDone,
  IconError,
  IconDownload,
} from "~/components/Icon";

import { styleDownload } from "./style.css";
import { accessToken } from "~/hooks/useSignIn";

/**
 * now playing audio info view
 */
export const Download = () => {
  const [status, setStatus] = createSignal("");

  const download = async () => {
    setStatus("loading");
    const token = accessToken();
    if (token === undefined) return;

    const data = await downloadLibraryData(token);
    if (data !== undefined) {
      addAudios(data);
      setStatus("done");
    } else {
      setStatus("error");
    }
  };

  return (
    <div class={styleDownload}>
      <button onClick={download}>
        <IconDownload />
        get library data from google drive
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
