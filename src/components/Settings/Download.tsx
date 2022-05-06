import { createSignal } from "solid-js";

import Icon from "~/components/GoogleIcon";
import LabelIcon from "~/components/LabelIcon";
import { downloadLibraryData, File } from "~/file";
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
    setStatus("pending_actions");
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
        <LabelIcon icon="file_download">
          get library data from google drive
        </LabelIcon>
      </button>
      <Icon icon={status()} />
    </div>
  );
};

export default Download;
