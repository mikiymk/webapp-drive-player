import React, { useState } from "react";

import Icon from "component/Common/Icon";
import LabelIcon from "component/Common/LabelIcon";
import { downloadLibraryData, File } from "file";

type Props = {
  addFiles: (file: File[]) => void;
};

/**
 * now playing audio info view
 */
const Download: React.FC<Props> = ({ addFiles }) => {
  const [status, setStatus] = useState("");
  return (
    <div>
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
