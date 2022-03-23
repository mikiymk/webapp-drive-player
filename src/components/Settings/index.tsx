import { File } from "file";
import React from "react";
import Download from "./Download";
import Upload from "./Upload";

type Props = {
  files: File[];
  addFiles: (file: File[]) => void;
};

/**
 * now playing audio info view
 */
const Settings: React.FC<Props> = ({ files, addFiles }) => {
  return (
    <div>
      <Upload files={files} />
      <Download addFiles={addFiles} />
    </div>
  );
};

export default Settings;
