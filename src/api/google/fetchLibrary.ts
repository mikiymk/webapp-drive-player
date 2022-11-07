import { getGoogleFile } from "~/api/google/file";
import { getFileID } from "~/api/google/metadata";
import { createAppData, uploadAppData } from "~/api/google/uploadFile";
import { AudioInfo } from "~/audio/AudioInfo";

import type { AudioEntries } from "~/signals/audios";

const FILE_NAME = "library.json";

let libraryID: string | undefined;
const getLibraryID = async (accessToken: string) => {
  if (libraryID !== undefined) return libraryID;
  libraryID = await getFileID(accessToken, FILE_NAME, true);
  return libraryID;
};

export const getLibrary = async (
  token: string
): Promise<AudioEntries | null> => {
  const id = await getLibraryID(token);
  if (id === undefined) return null;

  const response = await getGoogleFile(token, id);
  if (response === undefined) return null;

  const json: [string, AudioInfo][] = await response.json();

  return json.map(([id, info]): [string, AudioInfo] => {
    return [id, AudioInfo.copyInfo(info)];
  });
};

export const sendLibrary = async (token: string, data: AudioEntries) => {
  const id = await getLibraryID(token);
  const jsonData = JSON.stringify(Array.from(data));

  if (id !== undefined) {
    return uploadAppData(token, id, jsonData);
  } else {
    return createAppData(token, FILE_NAME, jsonData);
  }
};
