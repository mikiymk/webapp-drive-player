import React from "react";
import { getAllFiles } from "../api";
import { File } from "../type";

const DriveFiles: React.FC<{ signIn: boolean }> = ({ signIn }) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [dirs, setDirss] = React.useState<File[]>([]);

  React.useEffect(() => {
    if (signIn) {
      getAllFiles().then(files => setFiles(files));
    }
  }, [signIn]);

  return (
    <ul>
      {files.map(file => (
        <DriveFilesFile file={file} />
      ))}
    </ul>
  );
};

const DriveFilesFile: React.FC<{ file: File }> = ({ file: { name, id } }) => (
  <li>
    {name}({id})
  </li>
);

export default DriveFiles;
