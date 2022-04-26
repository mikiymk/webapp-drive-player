import { File } from "~/file";
import { useState, useEffect } from "react";

export const useGDriveParents = (
  accessToken: string,
  getAllFolders: (
    accessToken: string,
    parent?: string | undefined
  ) => Promise<File[]>,
  getAllMusics: (
    accessToken: string,
    parent?: string | undefined
  ) => Promise<File[]>
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
    getAllFolders(accessToken, parentId).then(setFolders).catch(console.log);
    getAllMusics(accessToken, parentId).then(setFiles).catch(console.log);
  }, [parents]);

  const addParents = (folder: File) => setParents(parents.concat([folder]));
  const move = (index: number) => setParents(parents.slice(0, index + 1));

  return { parents, folders, files, addParents, move };
};
