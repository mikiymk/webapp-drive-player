import Icon from "~/components/GoogleIcon";
import LabelIcon from "~/components/LabelIcon";
import { uploadLibraryData, File } from "~/file";
import { styleUpload } from "./style.css";
import { createSignal } from "solid-js";

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
    setStatus("pending_actions");
    uploadLibraryData(props.accessToken, props.files).then(response =>
      setStatus(response.status === 200 ? "done" : "error")
    );
  };

  return (
    <div class={styleUpload}>
      <button onClick={upload}>
        <LabelIcon
          icon="file_upload"
          text="send library data to google drive"
        />
      </button>
      <Icon icon={status()} />
    </div>
  );
};

export default Upload;
