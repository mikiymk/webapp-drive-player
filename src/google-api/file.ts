const GET_PAGE_SIZE = 100;

/**
 * get file list from google drive
 * @param query file search query string
 * see https://developers.google.com/drive/api/v3/ref-search-terms
 * @param token next page token
 * @returns files
 */
export const getList = async (query: string, token?: string) => {
  const response = await gapi.client.drive.files.list({
    fields: "nextPageToken, files(id, name)",
    pageSize: GET_PAGE_SIZE,
    pageToken: token,
    q: query,
  });

  return response.result;
};

/**
 * get file data at file id from google drive
 * @param fileId google drive file id
 * @returns file data string
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
