import Icon from "~/components/GoogleIcon";
import LabelIcon from "~/components/LabelIcon";
import { uploadLibraryData, File } from "~/file";
import React, { useState } from "react";
import { styleUpload } from "./style.css";

type Props = {
  accessToken: string;
  files: File[];
};

/**
 * now playing audio info view
 */
const Upload: React.FC<Props> = ({ accessToken, files }) => {
  const [status, setStatus] = useState("");
  return (
    <div className={styleUpload}>
      <button
        onClick={() => {
          setStatus("pending_actions");
          uploadLibraryData(accessToken, files).then(response =>
            setStatus(response.status === 200 ? "done" : "error")
          );
        }}>
        <LabelIcon
          icon="file_upload"
          text="send library data to google drive"
        />
      </button>
      <Icon icon={status} />
    </div>
  );
};

export default Upload;
