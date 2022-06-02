import { createAppData, uploadAppData } from "~/google/uploadFile";
import { downloadFile } from "~/google/downloadFile";
import { AudioInfo } from "~/audio/AudioInfo";
import type { AudioEntries, AudioMap } from "~/hooks/createAudios";
import { getFileID, getFileList } from "./google/getFileList";

/**
 * 全フォルダの一覧を入手
 * @param parent 親フォルダID
 * @returns folders list in parent folder
 */
export const getAllFolders = async (accessToken: string, parent?: string) =>
  getFileList(
    accessToken,
    `mimeType = 'application/vnd.google-apps.folder' and parents in '${
      parent ?? "root"
    }'`,
    false
  );

/**
 * 全音楽ファイルの一覧を入手
 * @param parent 親フォルダID
 * @returns music files list in parent folder
 */
export const getAllMusics = async (accessToken: string, parent?: string) =>
  getFileList(
    accessToken,
    `mimeType contains 'audio/' and parents in '${parent ?? "root"}'`,
    false
  );

const getPlaylistsID = (accessToken: string) => {
  return getFileID(accessToken, "playlists", true);
};

export const fetchPlaylistFiles = async (accessToken: string) => {
  const id = await getPlaylistsID(accessToken);
  if (id === undefined) return undefined;

  const response = await downloadFile(accessToken, id);
  if (response === null) return undefined;

  const text = await response.text();
  console.log(text);
  return text.split("\n");
};

const getLibraryID = (accessToken: string) => {
  return getFileID(accessToken, "library.json", true);
};

export const uploadLibraryData = async (
  accessToken: string,
  data: AudioMap
) => {
  const id = await getLibraryID(accessToken);
  const jsonData = JSON.stringify(Array.from(data));

  if (id !== undefined) {
    return uploadAppData(accessToken, id, jsonData);
  } else {
    return createAppData(accessToken, "library.json", jsonData);
  }
};

export const downloadLibraryData = async (
  accessToken: string
): Promise<AudioEntries | undefined> => {
  const id = await getLibraryID(accessToken);
  if (id === undefined) return undefined;

  const response = await downloadFile(accessToken, id);
  if (response === null) return undefined;

  const json: unknown = await response.json();
  if (!Array.isArray(json)) return undefined;

  const files = json.map(
    ([id, info]: [unknown, unknown]): [string, AudioInfo] => {
      return ["" + id, AudioInfo.copyInfo(info as AudioInfo)];
    }
  );

  console.log(files);
  return files;
};
