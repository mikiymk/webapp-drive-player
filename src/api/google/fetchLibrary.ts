import { getGoogleFile } from "~/api/google/file";
import { getFileID } from "~/api/google/metadata";
import { createAppData, uploadAppData } from "~/api/google/uploadFile";

const idMap: Record<string, string | undefined> = {};

/**
 * ファイル名からファイルIDを取得する
 * 前に取得している場合はリクエストを送らない
 * @param accessToken アクセストークン
 * @param fileName ファイル名
 * @returns ファイルが存在するならファイルID
 */
const getCachedFileID = async (
  accessToken: string,
  fileName: string,
): Promise<string | undefined> => {
  // TODO 一度キャッシュした後に別のアカウントに切り替えた場合
  if (idMap[fileName]) return idMap[fileName];

  idMap[fileName] = await getFileID(accessToken, fileName, true);
  return idMap[fileName];
};

/**
 * ファイル名からファイルのデータを取得する
 * @param token アクセストークン
 * @param fileName ファイル名
 * @returns ファイルの中身
 */
export const getSettingFile = async <T>(
  token: string,
  fileName: string,
): Promise<T | undefined> => {
  const id = await getCachedFileID(token, fileName);
  if (id === undefined) return undefined;

  const response = await getGoogleFile(token, id);
  if (response === undefined) return undefined;

  return response.json() as Promise<T>;
};

/**
 * ファイルの新しい内容を送信する
 * @param token アクセストークン
 * @param fileName ファイル名
 * @param data 送信するデータ
 * @returns 送信の結果
 */
export const postSettingFile = async <T>(
  token: string,
  fileName: string,
  data: T,
): Promise<Response> => {
  const id = await getCachedFileID(token, fileName);
  const jsonData = JSON.stringify(data);

  if (id !== undefined) {
    return uploadAppData(token, id, jsonData);
  }
  return createAppData(token, fileName, jsonData);
};
