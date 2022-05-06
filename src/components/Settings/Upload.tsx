import { uploadLibraryData, File } from "~/file";
import { styleUpload } from "./style.css";
import { createSignal, Match, Switch } from "solid-js";
import { IconDone, IconError, IconLoading, IconUpload } from "../Icon";

type Props = {
  accessToken: string;
  files: File[];
};

/**
 * now playing audio info view
 */
const Upload = (props: Props) => {
  const [status, setStatus] = createSignal("");
  const upload = () => {
    setStatus("loading");
    uploadLibraryData(props.accessToken, props.files).then(response =>
      setStatus(response.status === 200 ? "done" : "error")
    );
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

export default Upload;
