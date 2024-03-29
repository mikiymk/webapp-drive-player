import { getAllFolders, getAllMusics } from "~/file";

import { accessToken } from "~/signals/access-token";

import { audioEntryFromFile } from "./audioEntryFromGoogleFile";

import type { GoogleFile } from "~/api/google/type";
import type { AudioEntries } from "~/signals/audios";

export const getAudiosFromFolder = async (
  rootFolder: GoogleFile,
): Promise<AudioEntries> => {
  console.log("get all");
  const folders = new Set([rootFolder.id]);
  const filesPromises = [];

  const token = accessToken();
  if (!token) return [];

  for (const folder of folders) {
    const childFiles = getAllMusics(token, folder);
    const childFolders = await getAllFolders(token, folder);

    filesPromises.push(childFiles);

    for (const childFolder of childFolders) {
      folders.add(childFolder.id);
    }
  }

  console.log("got all folders");

  const files = await Promise.allSettled(filesPromises);

  console.log("got all");

  return files
    .flatMap((file) => (file.status === "fulfilled" ? file.value : []))
    .map(audioEntryFromFile);
};
