import { getGoogleMetadata } from "./api/google/metadata";

/**
 * 全フォルダの一覧を入手
 * @param parent 親フォルダID
 * @returns folders list in parent folder
 */
export const getAllFolders = async (accessToken: string, parent?: string) =>
  getGoogleMetadata(
    accessToken,
    `mimeType = 'application/vnd.google-apps.folder' and parents in '${
      parent ?? "root"
    }'`,
    false,
  );

/**
 * 全音楽ファイルの一覧を入手
 * @param parent 親フォルダID
 * @returns music files list in parent folder
 */
export const getAllMusics = async (accessToken: string, parent?: string) =>
  getGoogleMetadata(
    accessToken,
    `mimeType contains 'audio/' and parents in '${parent ?? "root"}'`,
    false,
  );
