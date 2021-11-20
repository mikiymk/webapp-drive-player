import React from "react";

import { Breadcrumbs } from "./Breakcrumbs";
import { Item } from "./Item";

import { getAllMusics, getAllFolders, File } from "../../file";

/**
 * get files from google drive
 */
const DriveFiles: React.FC<{
  signIn: boolean;
  addFile: (file: File) => void;
}> = ({ signIn, addFile }) => {
  const [parents, setParents] = React.useState<File[]>([
    { name: "root", id: "root" },
  ]);
  const [files, setFiles] = React.useState<File[]>([]);
  const [folders, setFolders] = React.useState<File[]>([]);

  React.useEffect(() => {
    if (signIn) {
      const parentId = parents[parents.length - 1].id;
      getAllFolders(parentId).then(setFolders);
      getAllMusics(parentId).then(setFiles);
    }
  }, [signIn, parents]);

  const addParents = (folder: File) => setParents(parents.concat([folder]));

  return (
    <>
      <Breadcrumbs parents={parents} setParents={setParents} />
      <ul>
        {folders.map(file => (
          <Item key={file.id} file={file} click={addParents} folder />
        ))}
        {files.map(file => (
          <Item key={file.id} file={file} click={addFile} />
        ))}
      </ul>
    </>
  );
};

export default DriveFiles;
