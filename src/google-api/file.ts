const GET_PAGE_SIZE = 100;

/**
 * Google Drive からファイルリストを入手
 * @param query 検索クエリ文字列 https://developers.google.com/drive/api/v3/ref-search-terms
 * @param token ページトークン
 */
export const getList = async (query: string, token?: string) => {
  const response = await gapi.client.drive.files.list({
    fields: "nextPageToken, files(id, name)",
    pageSize: GET_PAGE_SIZE,
    pageToken: token,
    orderBy: "name",
    q: query,
  });

  return response.result;
};

export const getAppDataList = async (query: string, token?: string) => {
  const response = await gapi.client.drive.files.list({
    spaces: "appDataFolder",
    fields: "nextPageToken, files(id, name)",
    pageSize: GET_PAGE_SIZE,
    pageToken: token,
    orderBy: "name",
    q: query,
  });

  return response.result;
};

/**
 * Google Drive からファイルをダウンロードする
 * @returns エラーなら `null`
 */
export const downloadFile = async (fileId: string) => {
  console.log(`download file ID ${fileId}`);
  try {
    const token = gapi.client.getToken().access_token;
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`downloaded ${fileId}`);
    return response;
  } catch (error) {
    console.error(`download error ${fileId}`, error);
    return null;
  }
};

const getMultipartBody = (data: object, metadata: object) => {
  const ln = "\r\n";
  const boundary = "--_boundary";

  const multipartBody =
    boundary +
    ln +
    "Content-Type: application/json; charset=UTF-8" +
    ln +
    ln +
    JSON.stringify(metadata) +
    ln +
    boundary +
    ln +
    "Content-Type: application/json; charset=UTF-8" +
    ln +
    ln +
    JSON.stringify(data) +
    ln +
    boundary +
    "--";

  return multipartBody;
};

export const uploadAppDataJson = async (fileId: string, data: object) => {
  const token = gapi.client.getToken().access_token;
  const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;

  const multipartBody = getMultipartBody(data, {});

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/related; boundary=_boundary",
      "Content-Length": multipartBody.length.toString(),
    },
    body: multipartBody,
  });

  console.log("upload", multipartBody, response);
  return response;
};

export const createAppDataJson = async (fileName: string, data: object) => {
  const token = gapi.client.getToken().access_token;
  const url =
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  const multipartBody = getMultipartBody(data, {
    name: fileName,
    parents: ["appDataFolder"],
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/related; boundary=_boundary",
      "Content-Length": multipartBody.length.toString(),
    },
    body: multipartBody,
  });

  console.log("create", multipartBody, response);
  return response;
};
