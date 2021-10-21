import React from "react";
import { getAllMusics, getAllFolders } from "../api";
import { File } from "../type";

const DriveFiles: React.FC<{ signIn: boolean }> = ({ signIn }) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [folders, setFolders] = React.useState<File[]>([]);

  React.useEffect(() => {
    if (signIn) {
      getAllFolders().then(folders => setFolders(folders));
      getAllMusics().then(files => setFiles(files));
    }
  }, [signIn]);

  return (
    <ul>
      {folders.map(file => (
        <DriveFilesFolder file={file} />
      ))}
      {files.map(file => (
        <DriveFilesFile file={file} />
      ))}
    </ul>
  );
};

const DriveFilesFolder: React.FC<{ file: File }> = ({ file: { name, id } }) => (
  <li>
    <a>
      Folder:{name}({id})
    </a>
  </li>
);

const DriveFilesFile: React.FC<{ file: File }> = ({ file: { name, id } }) => (
  <li>
    {name}({id})
  </li>
);

export default DriveFiles;
