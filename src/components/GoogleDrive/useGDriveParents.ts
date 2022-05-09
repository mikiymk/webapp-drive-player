import { Accessor, createEffect, createSignal } from "solid-js";
import type { GoogleFile } from "~/file";

export const useGDriveParents = (
  accessToken: Accessor<string>,
  getAllFolders: (
    accessToken: string,
    parent?: string | undefined
  ) => Promise<GoogleFile[]>,
  getAllMusics: (
    accessToken: string,
    parent?: string | undefined
  ) => Promise<GoogleFile[]>
) => {
  const [parents, setParents] = createSignal<GoogleFile[]>([
    { name: "root", id: "root" },
  ]);
  const [files, setFiles] = createSignal<GoogleFile[]>([]);
  const [folders, setFolders] = createSignal<GoogleFile[]>([]);

  createEffect(() => {
    const parentId = parents().at(-1)?.id;
    setFolders([]);
    setFiles([]);
    getAllFolders(accessToken(), parentId).then(setFolders).catch(console.log);
    getAllMusics(accessToken(), parentId).then(setFiles).catch(console.log);
  });

  const addParents = (folder: GoogleFile) =>
    setParents(parents => parents.concat([folder]));
  const move = (index: number) =>
    setParents(parents => parents.slice(0, index + 1));

  return { parents, folders, files, addParents, move };
};
