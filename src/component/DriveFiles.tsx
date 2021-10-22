import React from "react";
import { getAllMusics, getAllFolders } from "../api";
import { File } from "../type";

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
      getAllFolders(parentId).then(folders => setFolders(folders));
      getAllMusics(parentId).then(files => setFiles(files));
    }
  }, [signIn, parents]);

  const addParents = (folder: File) => setParents(parents.concat([folder]));

  return (
    <>
      <Breadcrumbs parents={parents} setParents={setParents} />
      <ul>
        {folders.map(file => (
          <DriveFilesFile key={file.id} file={file} click={addParents} folder />
        ))}
        {files.map(file => (
          <DriveFilesFile key={file.id} file={file} click={addFile} />
        ))}
      </ul>
    </>
  );
};

const Breadcrumbs: React.FC<{
  parents: File[];
  setParents: (parents: File[]) => void;
}> = ({ parents, setParents }) => (
  <div>
    {parents
      .map((parent, index) => (
        <a
          key={parent.id}
          onClick={() => setParents(parents.slice(0, index + 1))}>
          {parent.name}
        </a>
      ))
      .flatMap((value, index) => [index !== 0 ? " > " : null, value])}
  </div>
);

const DriveFilesFile: React.FC<{
  file: File;
  click: (file: File) => void;
  folder?: boolean;
}> = ({ file, click, folder: isFolder }) => (
  <li>
    <a onClick={() => click(file)}>
      {isFolder && "Folder:"}
      {file.name}({file.id})
    </a>
  </li>
);

export default DriveFiles;
