import { fetchGet } from "./fetchGet";

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
