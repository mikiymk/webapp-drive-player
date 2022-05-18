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
