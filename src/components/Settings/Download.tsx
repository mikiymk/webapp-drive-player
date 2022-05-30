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

export type DownloadProps = {
  accessToken: string | undefined;
};

/**
 * now playing audio info view
 */
export const Download = (props: DownloadProps) => {
  const [status, setStatus] = createSignal("");

  const download = async () => {
    setStatus("loading");
    if (props.accessToken === undefined) return;

    const data = await downloadLibraryData(props.accessToken);
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
