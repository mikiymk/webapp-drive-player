import { createSignal, Match, Switch } from "solid-js";

import { downloadLibraryData } from "~/file";
import { useAudios } from "~/hooks/createFiles";
import {
  IconLoading,
  IconDone,
  IconError,
  IconDownload,
} from "~/components/Icon";

import { styleDownload } from "./style.css";

export type DownloadProps = {
  accessToken: string;
};

/**
 * now playing audio info view
 */
export const Download = (props: DownloadProps) => {
  const [status, setStatus] = createSignal("");
  const audios = useAudios();

  const download = () => {
    setStatus("loading");
    downloadLibraryData(props.accessToken).then(data => {
      if (data !== undefined) {
        audios.addAudios(data);
        setStatus("done");
      } else {
        setStatus("error");
      }
    });
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
        </Match>{" "}
        <Match when={status() === "done"}>
          <IconDone />
        </Match>{" "}
        <Match when={status() === "error"}>
          <IconError />
        </Match>
      </Switch>
    </div>
  );
};
