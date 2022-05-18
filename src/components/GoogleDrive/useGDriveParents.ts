import { Accessor, createResource, createSignal } from "solid-js";

import { getAllMusics, getAllFolders } from "~/file";
import type { GoogleFile } from "~/file";

export const useGDriveParents = (accessToken: Accessor<string>) => {
  const [parents, setParents] = createSignal<GoogleFile[]>([
    { name: "root", id: "root" },
  ]);

  const [files, { refetch: refetchFiles }] = createResource(
    accessToken,
    (key, { refetching: r }) => getAllMusics(key, r as string)
  );
  const [folders, { refetch: refetchFolders }] = createResource(
    accessToken,
    (key, { refetching: r }) => getAllFolders(key, r as string)
  );

  const refetch = (info: string | undefined) => {
    refetchFiles(info);
    refetchFolders(info);
  };

  const addParents = (folder: GoogleFile) => {
    setParents(parents => parents.concat([folder]));
    refetch(parents().at(-1)?.id);
  };
  const move = (index: number) => {
    setParents(parents => parents.slice(0, index + 1));
    refetch(parents().at(-1)?.id);
  };

  return { parents, folders, files, addParents, move };
};
