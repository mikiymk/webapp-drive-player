import { Accessor, createEffect, createSignal } from "solid-js";
import { File } from "~/file";

export const useGDriveParents = (
  accessToken: Accessor<string>,
  getAllFolders: (
    accessToken: string,
    parent?: string | undefined
  ) => Promise<File[]>,
  getAllMusics: (
    accessToken: string,
    parent?: string | undefined
  ) => Promise<File[]>
) => {
  const [parents, setParents] = createSignal<File[]>([
    { name: "root", id: "root" },
  ]);
  const [files, setFiles] = createSignal<File[]>([]);
  const [folders, setFolders] = createSignal<File[]>([]);

  createEffect(() => {
    const parentId = parents().at(-1)?.id;
    setFolders([]);
    setFiles([]);
    getAllFolders(accessToken(), parentId).then(setFolders).catch(console.log);
    getAllMusics(accessToken(), parentId).then(setFiles).catch(console.log);
  });

  const addParents = (folder: File) =>
    setParents(parents => parents.concat([folder]));
  const move = (index: number) =>
    setParents(parents => parents.slice(0, index + 1));

  return { parents, folders, files, addParents, move };
};
