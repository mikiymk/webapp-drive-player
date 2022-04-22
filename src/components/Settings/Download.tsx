import React, { useState } from "react";

import Icon from "components/GoogleIcon";
import LabelIcon from "components/LabelIcon";
import { downloadLibraryData, File } from "file";
import { styleDownload } from "./style.css";

type Props = {
  addFiles: (file: File[]) => void;
};

/**
 * now playing audio info view
 */
const Download: React.FC<Props> = ({ addFiles }) => {
  const [status, setStatus] = useState("");
  return (
    <div className={styleDownload}>
      <button
        onClick={() => {
          setStatus("pending_actions");
          downloadLibraryData().then(files => {
            if (files !== undefined) {
              addFiles(files);
              setStatus("done");
            } else {
              setStatus("error");
            }
          });
        }}>
        <LabelIcon
          icon="file_download"
          text="get library data from google drive"
        />
      </button>
      <Icon icon={status} />
    </div>
  );
};

export default Download;
