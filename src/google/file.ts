import { generateUrl } from "./generateUrl";

const GET_PAGE_SIZE = 100;

const fetchGet = (url: string, accessToken: string) => {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

/**
 * Google Drive からファイルリストを入手
 * @param query 検索クエリ文字列 https://developers.google.com/drive/api/v3/ref-search-terms
 * @param token ページトークン
 */
export const getList = (
  accessToken: string,
  query: string,
  token?: string
): Promise<{
  files: { id: string; name: string }[];
  nextPageToken?: string;
}> => {
  const url = generateUrl("https://www.googleapis.com/drive/v3/files", [
    ["fields", "nextPageToken, files(id, name)"],
    ["pageSize", GET_PAGE_SIZE],
    ["pageToken", token],
    ["orderBy", "name"],
    ["q", query],
  ]);

  return fetchGet(url, accessToken).then(response => response.json());
};

export const getAppDataList = (
  accessToken: string,
  query: string,
  token?: string
) => {
  const url = generateUrl("https://www.googleapis.com/drive/v3/files", [
    ["spaces", "appDataFolder"],
    ["fields", "nextPageToken, files(id, name)"],
    ["pageSize", GET_PAGE_SIZE],
    ["pageToken", token],
    ["orderBy", "name"],
    ["q", query],
  ]);

  return fetchGet(url, accessToken).then(response => response.json());
};

/**
 * Google Drive からファイルをダウンロードする
 * @returns エラーなら `null`
 */
export const downloadFile = async (accessToken: string, fileId: string) => {
  try {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const response = await fetchGet(url, accessToken);

    if (!response.ok) {
      const responseData = JSON.stringify(await response.json(), null, 2);
      throw new Error(
        `${response.status} ${response.statusText} ${responseData}`
      );
    }

    return response;
  } catch (error) {
    return null;
  }
};

const getMultipartBody = (data: object, metadata: object, boundary: string) => {
  return `--${boundary}
Content-Type: application/json; charset=UTF-8

${JSON.stringify(metadata)}
--${boundary}
Content-Type: application/json; charset=UTF-8

${JSON.stringify(data)}
--${boundary}--`;
};

export const uploadAppDataJson = async (
  accessToken: string,
  fileId: string,
  data: object
) => {
  const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;

  const boundary = "_boundary" + Math.random().toString(16).substring(2);
  const multipartBody = getMultipartBody(data, {}, boundary);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/related; boundary=" + boundary,
      "Content-Length": multipartBody.length.toString(),
    },
    body: multipartBody,
  });

  console.log("upload", multipartBody, response);
  return response;
};

export const createAppDataJson = async (
  accessToken: string,
  fileName: string,
  data: object
) => {
  const url =
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  const boundary = "_boundary" + Math.random().toString(16).substring(2);
  const multipartBody = getMultipartBody(
    data,
    { name: fileName, parents: ["appDataFolder"] },
    boundary
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/related; boundary=" + boundary,
      "Content-Length": multipartBody.length.toString(),
    },
    body: multipartBody,
  });

  console.log("create", multipartBody, response);
  return response;
};
