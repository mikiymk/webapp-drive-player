import { File } from "~/file";
import { useState, useEffect } from "react";

export const useGDriveParents = (
  getAllFolders: (parent?: string | undefined) => Promise<File[]>,
  getAllMusics: (parent?: string | undefined) => Promise<File[]>
) => {
  const [parents, setParents] = useState<File[]>([
    { name: "root", id: "root" },
  ]);
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<File[]>([]);

  useEffect(() => {
    const parentId = parents[parents.length - 1].id;
    setFolders([]);
    setFiles([]);
    getAllFolders(parentId).then(setFolders).catch(console.log);
    getAllMusics(parentId).then(setFiles).catch(console.log);
  }, [parents]);

  const addParents = (folder: File) => setParents(parents.concat([folder]));
  const move = (index: number) => setParents(parents.slice(0, index + 1));

  return { parents, folders, files, addParents, move };
};
