import { uploadLibraryData } from "~/file";
import { styleUpload } from "./style.css";
import { createSignal, Match, Switch } from "solid-js";
import { IconDone, IconError, IconLoading, IconUpload } from "../Icon";
import { useFiles } from "~/hooks/createFiles";
import AudioInfo from "~/audio/AudioInfo";

type Props = {
  accessToken: string;
};

/**
 * now playing audio info view
 */
const Upload = (props: Props) => {
  const [status, setStatus] = createSignal("");
  const upload = () => {
    setStatus("loading");
    const files = useFiles();
    uploadLibraryData(
      props.accessToken,
      Object.entries(files.files).map(([k, v]) =>
        v instanceof AudioInfo
          ? { id: k, name: v.title, info: v }
          : { id: k, name: v.title }
      )
    ).then(response => setStatus(response.status === 200 ? "done" : "error"));
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
