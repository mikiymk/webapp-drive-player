import { downloadFile } from "~/api/google/downloadFile";
import { getFileID } from "~/api/google/getFileList";
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

  const response = await downloadFile(token, id);
  if (response === null) return null;

  const json: unknown = await response.json();
  if (!Array.isArray(json)) return null;

  const files = json.map(
    ([id, info]: [unknown, unknown]): [string, AudioInfo] => {
      return ["" + id, AudioInfo.copyInfo(info as AudioInfo)];
    }
  );

  console.log(files);
  return files;
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
