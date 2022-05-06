import { createSignal, Match, Switch } from "solid-js";

import { downloadLibraryData, File } from "~/file";
import { IconLoading, IconDone, IconError, IconDownload } from "../Icon";
import { styleDownload } from "./style.css";

type Props = {
  accessToken: string;
  addFiles: (file: File[]) => void;
};

/**
 * now playing audio info view
 */
const Download = (props: Props) => {
  const [status, setStatus] = createSignal("");
  const download = () => {
    setStatus("loading");
    downloadLibraryData(props.accessToken).then(files => {
      if (files !== undefined) {
        props.addFiles(files);
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

export default Download;
