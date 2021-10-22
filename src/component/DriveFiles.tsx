import React from "react";
import { getAllMusics, getAllFolders } from "../api";
import { File } from "../type";

const DriveFiles: React.FC<{ signIn: boolean }> = ({ signIn }) => {
  const [parents, setParents] = React.useState(["root"]);
  const [files, setFiles] = React.useState<File[]>([]);
  const [folders, setFolders] = React.useState<File[]>([]);

  React.useEffect(() => {
    if (signIn) {
      const parent = parents[parents.length - 1];
      getAllFolders(parent).then(folders => setFolders(folders));
      getAllMusics(parent).then(files => setFiles(files));
    }
  }, [signIn, parents]);

  const addParents = (folder: string) => setParents(parents.concat([folder]));

  return (
    <ul>
      {folders.map(file => (
        <DriveFilesFolder file={file} click={addParents} />
      ))}
      {files.map(file => (
        <DriveFilesFile file={file} />
      ))}
    </ul>
  );
};

const DriveFilesFolder: React.FC<{
  file: File;
  click: (folder: string) => void;
}> = ({ file: { name, id }, click }) => (
  <li>
    <a onClick={() => click(id)}>
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
