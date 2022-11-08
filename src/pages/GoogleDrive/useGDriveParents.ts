import { createEffect, createSignal } from "solid-js";

import { getAllFolders, getAllMusics } from "~/file";

import { accessToken } from "~/signals/access-token";

import type { GoogleFile } from "~/api/google/type";

export const useGDriveParents = () => {
  const [parents, setParents] = createSignal<GoogleFile[]>([
    { name: "root", id: "root" },
  ]);

  const [loading, setLoading] = createSignal(false);
  const [files, setFiles] = createSignal<GoogleFile[]>([]);
  const [folders, setFolders] = createSignal<GoogleFile[]>([]);
  createEffect(() => {
    const parent = parents().at(-1)?.id;
    const token = accessToken();
    if (!token) return;

    setLoading(true);
    const newFiles = getAllMusics(token, parent);
    const newFolders = getAllFolders(token, parent);

    void Promise.all([newFiles, newFolders]).then(([newFiles, newFolders]) => {
      setFiles(newFiles);
      setFolders(newFolders);
      setLoading(false);
    });
  });

  const addParents = (folder: GoogleFile) =>
    setParents((parents) => parents.concat([folder]));

  const move = (index: number) =>
    setParents((parents) => parents.slice(0, index + 1));

  return { parents, loading, folders, files, addParents, move };
};
