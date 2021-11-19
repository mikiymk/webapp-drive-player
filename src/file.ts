import { getList } from "./google-api/file";

export type File = {
  name: string;
  id: string;
};

type Result = [File[], string | undefined];

const getPagedFiles = async (
  query: string,
  token?: string
): Promise<Result> => {
  const result = await getList(query, token);

  const rowFiles = result.files ?? [];
  const files = rowFiles
    .map(({ id, name }) => ({ id, name }))
    .filter((obj): obj is File => !!(obj.id && obj.name));
  const nextToken = result.nextPageToken;

  return [files, nextToken];
};

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
 * get folders in parent folder
 * @param parent parent folder id
 * @returns folders list in parent folder
 */
export const getAllFolders = async (parent?: string) =>
  getAllFiles(
    `mimeType = 'application/vnd.google-apps.folder' and parents in '${
      parent ?? "root"
    }'`
  );

/**
 * get music files in parent folder
 * @param parent parent folder id
 * @returns music files list in parent folder
 */
export const getAllMusics = async (parent?: string) =>
  getAllFiles(
    `mimeType contains 'audio/' and parents in '${parent ?? "root"}'`
  );
