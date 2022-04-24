import {
  createAppDataJson,
  downloadFile,
  getAppDataList,
  getList,
  uploadAppDataJson,
} from "~/google-api/file";

import AudioInfo from "~/audio/AudioInfo";

export class File {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public info?: AudioInfo
  ) {
    // EMPTY
  }
}

type Result = [File[], string | undefined];

/** ファイルリストの一部を入手 */
const getPagedFiles = async (
  accessToken: string,
  query: string,
  token?: string
): Promise<Result> => {
  const result = await getList(accessToken, query, token);

  const rowFiles: { id: string; name: string }[] = result.files ?? [];
  const files = rowFiles.flatMap(({ id, name }) => {
    if (id !== undefined && name !== undefined) return [new File(id, name)];
    else return [];
  });
  const nextToken = result.nextPageToken;

  return [files, nextToken];
};

/** ファイルリストをまとめて全ファイルリストを入手 */
const getAllFiles = async (accessToken: string, query: string) => {
  let token = undefined;
  let isFirst = true;
  let allFiles: File[] = [];

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

export const uploadLibraryData = async (accessToken: string, files: File[]) => {
  const filesData = files.map(file => ({
    id: file.id,
    name: file.name,
    info: file.info,
  }));

  const id = await getLibraryID(accessToken);

  if (id !== undefined) {
    return uploadAppDataJson(accessToken, id, filesData);
  } else {
    return createAppDataJson(accessToken, "library.json", filesData);
  }
};

export const downloadLibraryData = async (
  accessToken: string
): Promise<File[] | undefined> => {
  const id = await getLibraryID(accessToken);

  if (id === undefined) {
    return;
  }
  const response = await downloadFile(accessToken, id);
  if (response === null) {
    return;
  }
  const json = await response.json();

  if (!Array.isArray(json)) {
    return;
  }

  const files = json
    .filter(
      (
        file: unknown
      ): file is {
        id: string;
        name: string;
        info: AudioInfo;
      } => {
        if (typeof file !== "object") {
          return false;
        } else if (file === null) {
          return false;
        }
        return "id" in file && "name" in file && "info" in file;
      }
    )
    .map(({ id, name, info }) => new File(id, name, AudioInfo.copyInfo(info)));
  console.log(files);
  return files;
};
