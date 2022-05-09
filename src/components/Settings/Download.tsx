import { createSignal, Match, Switch } from "solid-js";

import { downloadLibraryData } from "~/file";
import { File, useFiles } from "~/hooks/createFiles";
import { IconLoading, IconDone, IconError, IconDownload } from "../Icon";
import { styleDownload } from "./style.css";

type Props = {
  accessToken: string;
};

/**
 * now playing audio info view
 */
const Download = (props: Props) => {
  const [status, setStatus] = createSignal("");
  const files = useFiles();
  const addFiles = (newFiles: [string, File][]) => {
    files.addFiles(newFiles);
  };
  const download = () => {
    setStatus("loading");
    downloadLibraryData(props.accessToken).then(files => {
      if (files !== undefined) {
        addFiles(
          files.map(file =>
            file.info
              ? [file.id, file.info]
              : [file.id, { id: file.id, title: file.name }]
          )
        );
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
