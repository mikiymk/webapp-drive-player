import {
  createAppDataJson,
  downloadFile,
  getAppDataList,
  getList,
  uploadAppDataJson,
} from "~/google/file";

import { AudioInfo } from "~/audio/AudioInfo";
import type { AudioRecord } from "./hooks/createFiles";

export type GoogleFile = {
  readonly id: string;
  readonly name: string;
};

type Result = [GoogleFile[], string | undefined];

/** ファイルリストの一部を入手 */
const getPagedFiles = async (
  accessToken: string,
  query: string,
  token?: string
): Promise<Result> => {
  const result = await getList(accessToken, query, token);

  const rowFiles = result.files ?? [];
  const files = rowFiles.flatMap(({ id, name }) => {
    if (typeof id === "string" && typeof name === "string")
      return [{ id, name }];
    else return [];
  });
  const nextToken = result.nextPageToken;

  return [files, nextToken];
};

/** ファイルリストをまとめて全ファイルリストを入手 */
const getAllFiles = async (accessToken: string, query: string) => {
  let token = undefined;
  let isFirst = true;
  let allFiles: GoogleFile[] = [];

  while (token || isFirst) {
    const [paged, next]: Result = await getPagedFiles(
      accessToken,
      query,
      token
    );

    allFiles = allFiles.concat(paged);
    token = next;
    isFirst = false;
  }

  return allFiles;
};

/**
 * 全フォルダの一覧を入手
 * @param parent 親フォルダID
 * @returns folders list in parent folder
 */
export const getAllFolders = async (accessToken: string, parent?: string) =>
  getAllFiles(
    accessToken,
    `mimeType = 'application/vnd.google-apps.folder' and parents in '${
      parent ?? "root"
    }'`
  );

/**
 * 全音楽ファイルの一覧を入手
 * @param parent 親フォルダID
 * @returns music files list in parent folder
 */
export const getAllMusics = async (accessToken: string, parent?: string) =>
  getAllFiles(
    accessToken,
    `mimeType contains 'audio/' and parents in '${parent ?? "root"}'`
  );

const getLibraryID = async (accessToken: string): Promise<string | undefined> =>
  getAppDataList(accessToken, "name = 'library.json'").then(result => {
    console.log(result);
    return result.files ? result.files[0]?.id : undefined;
  });

export const uploadLibraryData = async (
  accessToken: string,
  files: AudioRecord
) => {
  const id = await getLibraryID(accessToken);

  if (id !== undefined) {
    return uploadAppDataJson(accessToken, id, files);
  } else {
    return createAppDataJson(accessToken, "library.json", files);
  }
};

export const downloadLibraryData = async (
  accessToken: string
): Promise<AudioRecord | undefined> => {
  const id = await getLibraryID(accessToken);
  if (id === undefined) return;

  const response = await downloadFile(accessToken, id);
  if (response === null) return;

  const json: unknown = await response.json();
  if (typeof json !== "object") return;
  if (json === null) return;

  const files = Object.entries(json).map(
    ([id, info]: [string, unknown]): [string, AudioInfo] => {
      return ["" + id, AudioInfo.copyInfo(info as AudioInfo)];
    }
  );

  console.log(files);
  return Object.fromEntries(files);
};
