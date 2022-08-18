import { getAllMusics, getAllFolders } from "~/file";

import { accessToken } from "~/hooks/useSignIn";

import { audioEntryFromFile } from "./audioEntryFromGoogleFile";

import type { GoogleFile } from "~/google/type";
import type { AudioEntries } from "~/hooks/createAudios";

export const getAudiosFromFolder = async (
  rootFolder: GoogleFile
): Promise<AudioEntries> => {
  const folders = new Set([rootFolder.id]);
  let audioEntries: AudioEntries = [];

  const token = accessToken();
  if (!token) return [];

  for (const folder of folders) {
    const childFiles = await getAllMusics(token, folder);
    const childFolders = await getAllFolders(token, folder);

    audioEntries = audioEntries.concat(childFiles.map(audioEntryFromFile));

    for (const childFolder of childFolders) {
      folders.add(childFolder.id);
    }
  }

  return audioEntries;
};
