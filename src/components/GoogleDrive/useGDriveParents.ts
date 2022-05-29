import { Accessor, createEffect, createSignal } from "solid-js";

import { getAllMusics, getAllFolders } from "~/file";
import type { GoogleFile } from "~/file";

export const useGDriveParents = (accessToken: Accessor<string | undefined>) => {
  const [parents, setParents] = createSignal<GoogleFile[]>([
    { name: "root", id: "root" },
  ]);

  const [files, setFiles] = createSignal<GoogleFile[]>([]);
  const [folders, setFolders] = createSignal<GoogleFile[]>([]);
  createEffect(() => {
    const parent = parents().at(-1)?.id;
    const token = accessToken();
    if (!token) return;

    const newFiles = getAllMusics(token, parent);
    const newFolders = getAllFolders(token, parent);

    Promise.all([newFiles, newFolders]).then(([newFiles, newFolders]) => {
      setFiles(newFiles);
      setFolders(newFolders);
    });
  });

  const addParents = (folder: GoogleFile) =>
    setParents(parents => parents.concat([folder]));

  const move = (index: number) =>
    setParents(parents => parents.slice(0, index + 1));

  return { parents, folders, files, addParents, move };
};
