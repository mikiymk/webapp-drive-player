import { getGoogleFile } from "~/api/google/file";
import { getFileID } from "~/api/google/metadata";
import { createAppData, uploadAppData } from "~/api/google/uploadFile";

const idMap: Record<string, string | undefined> = {};
const getCachedFileID = async (
  accessToken: string,
  fileName: string,
): Promise<string | undefined> => {
  if (idMap[fileName]) return idMap[fileName];

  idMap[fileName] = await getFileID(accessToken, fileName, true);
  return idMap[fileName];
};

export const getSettingFile = async <T>(
  token: string,
  fileName: string,
): Promise<T | null> => {
  const id = await getCachedFileID(token, fileName);
  if (id === undefined) return null;

  const response = await getGoogleFile(token, id);
  if (response === undefined) return null;

  return response.json() as Promise<T>;
};

export const postSettingFile = async <T>(
  token: string,
  fileName: string,
  data: T,
): Promise<Response> => {
  const id = await getCachedFileID(token, fileName);
  const jsonData = JSON.stringify(data);

  if (id !== undefined) {
    return uploadAppData(token, id, jsonData);
  } else {
    return createAppData(token, fileName, jsonData);
  }
};
