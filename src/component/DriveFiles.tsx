import React from "react";
import { getAllMusics, getAllFolders } from "../api";
import { File } from "../type";

const DriveFiles: React.FC<{ signIn: boolean }> = ({ signIn }) => {
  const [parents, setParents] = React.useState<File[]>([
    { name: "root", id: "root" },
  ]);
  const [files, setFiles] = React.useState<File[]>([]);
  const [folders, setFolders] = React.useState<File[]>([]);

  React.useEffect(() => {
    if (signIn) {
      const parentId = parents[parents.length - 1].id;
      getAllFolders(parentId).then(folders => setFolders(folders));
      getAllMusics(parentId).then(files => setFiles(files));
    }
  }, [signIn, parents]);

  const addParents = (folder: File) => setParents(parents.concat([folder]));

  return (
    <ul>
      {folders.map(file => (
        <DriveFilesFolder key={file.id} file={file} click={addParents} />
      ))}
      {files.map(file => (
        <DriveFilesFile key={file.id} file={file} />
      ))}
    </ul>
  );
};

const DriveFilesFolder: React.FC<{
  file: File;
  click: (folder: File) => void;
}> = ({ file, click }) => (
  <li>
    <a onClick={() => click(file)}>
      Folder:{file.name}({file.id})
    </a>
  </li>
);

const DriveFilesFile: React.FC<{ file: File }> = ({ file: { name, id } }) => (
  <li>
    {name}({id})
  </li>
);

export default DriveFiles;
