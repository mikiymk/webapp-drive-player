import { getList } from "google-api/file";

export class File {
  constructor(public readonly id: string, public readonly name: string) {
    // EMPTY
  }
}

type Result = [File[], string | undefined];

/** ファイルリストの一部を入手 */
const getPagedFiles = async (
  query: string,
  token?: string
): Promise<Result> => {
  const result = await getList(query, token);

  const rowFiles = result.files ?? [];
  const files = rowFiles.flatMap(({ id, name }) => {
    if (id !== undefined && name !== undefined) return [new File(id, name)];
    else return [];
  });
  const nextToken = result.nextPageToken;

  return [files, nextToken];
};

/** ファイルリストをまとめて全ファイルリストを入手 */
const getAllFiles = async (query: string) => {
  let token = undefined;
  let isFirst = true;
  let allFiles: File[] = [];

  while (token || isFirst) {
    const [paged, next]: Result = await getPagedFiles(query, token);

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
export const getAllFolders = async (parent?: string) =>
  getAllFiles(
    `mimeType = 'application/vnd.google-apps.folder' and parents in '${
      parent ?? "root"
    }'`
  );

/**
 * 全音楽ファイルの一覧を入手
 * @param parent 親フォルダID
 * @returns music files list in parent folder
 */
export const getAllMusics = async (parent?: string) =>
  getAllFiles(
    `mimeType contains 'audio/' and parents in '${parent ?? "root"}'`
  );
