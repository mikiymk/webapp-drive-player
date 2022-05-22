import { Accessor, createResource, createSignal } from "solid-js";

import { getAllMusics, getAllFolders } from "~/file";
import type { GoogleFile } from "~/file";

export const useGDriveParents = (accessToken: Accessor<string | undefined>) => {
  const [parents, setParents] = createSignal<GoogleFile[]>([
    { name: "root", id: "root" },
  ]);

  const [files, filesAction] = createResource(accessToken, key =>
    getAllMusics(key, parents().at(-1)?.id)
  );
  const [folders, foldersAction] = createResource(accessToken, key =>
    getAllFolders(key, parents().at(-1)?.id)
  );

  const refetch = () => {
    filesAction.refetch();
    foldersAction.refetch();
  };

  const addParents = (folder: GoogleFile) => {
    setParents(parents => parents.concat([folder]));
    refetch();
  };
  const move = (index: number) => {
    setParents(parents => parents.slice(0, index + 1));
    refetch();
  };

  return { parents, folders, files, addParents, move };
};
