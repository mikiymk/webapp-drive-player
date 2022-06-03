const getMultipartBody = (data: string, metadata: object, boundary: string) => {
  return `--${boundary}
Content-Type: application/json; charset=UTF-8

${JSON.stringify(metadata)}
--${boundary}
Content-Type: application/json; charset=UTF-8

${data}
--${boundary}--`;
};

const ramdomString = () => Math.random().toString(16).substring(2);

export const uploadAppData = async (
  token: string,
  fileId: string,
  data: string
) => {
  const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;

  const boundary = "_boundary" + ramdomString();
  const body = getMultipartBody(data, {}, boundary);

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/related; boundary=" + boundary,
      "Content-Length": body.length.toString(),
    },
    body,
  });

  console.log("upload", body, response);
  return response;
};

export const createAppData = async (
  token: string,
  fileName: string,
  data: string
) => {
  const url =
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

  const boundary = "_boundary" + ramdomString();
  const body = getMultipartBody(
    data,
    { name: fileName, parents: ["appDataFolder"] },
    boundary
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/related; boundary=" + boundary,
      "Content-Length": body.length.toString(),
    },
    body,
  });

  console.log("create", body, response);
  return response;
};
