import { File } from "file";
import { useState, useEffect } from "react";

export const useGDriveParents = (
  signIn: boolean,
  getAllFolders: (parent?: string | undefined) => Promise<File[]>,
  getAllMusics: (parent?: string | undefined) => Promise<File[]>
) => {
  const [parents, setParents] = useState<File[]>([
    { name: "root", id: "root" },
  ]);
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<File[]>([]);

  useEffect(() => {
    if (signIn) {
      const parentId = parents[parents.length - 1].id;
      setFolders([]);
      setFiles([]);
      getAllFolders(parentId).then(setFolders);
      getAllMusics(parentId).then(setFiles);
    }
  }, [signIn, parents]);

  const addParents = (folder: File) => setParents(parents.concat([folder]));
  const move = (index: number) => setParents(parents.slice(0, index + 1));

  return { parents, folders, files, addParents, move };
};
