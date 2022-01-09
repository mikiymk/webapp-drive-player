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
    console.error(error);
    return null;
  }
};
