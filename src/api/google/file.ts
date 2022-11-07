import { fetchGetWithBearer } from "../util/withBearer";

/**
 * Google Drive からファイルをダウンロードする
 * @returns エラーなら `undefined`
 */
export const getGoogleFile = async (
  accessToken: string | undefined,
  fileId: string
) => {
  try {
    if (accessToken === undefined) return undefined;
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const response = await fetchGetWithBearer(url, accessToken);

    if (!response.ok) {
      const responseData = JSON.stringify(await response.json(), null, 2);
      throw new Error(
        `${response.status} ${response.statusText} ${responseData}`
      );
    }

    return response;
  } catch (error) {
    return undefined;
  }
};
