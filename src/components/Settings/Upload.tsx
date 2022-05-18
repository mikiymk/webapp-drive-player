import { createSignal, Match, Switch } from "solid-js";
import {
  IconDone,
  IconError,
  IconLoading,
  IconUpload,
} from "~/components/Icon";
import { uploadLibraryData } from "~/file";
import { useAudios } from "~/hooks/createFiles";

import { styleUpload } from "./style.css";

export type UploadProps = {
  accessToken: string;
};

/**
 * now playing audio info view
 */
export const Upload = (props: UploadProps) => {
  const [status, setStatus] = createSignal("");
  const upload = () => {
    setStatus("loading");
    const audios = useAudios();
    uploadLibraryData(props.accessToken, audios.audios).then(response =>
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
