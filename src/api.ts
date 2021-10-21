import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from "./api_keys";
import { File } from "./type";

const GET_PAGE_SIZE = 100;

type Result = [File[], string | undefined];

const getList = async (query: string, token?: string) => {
  const response = await gapi.client.drive.files.list({
    fields: "nextPageToken, files(id, name)",
    pageSize: GET_PAGE_SIZE,
    pageToken: token,
    q: query,
  });

  return response.result;
};

const getPagedFiles = async (
  query: string,
  token?: string
): Promise<Result> => {
  const result = await getList(query, token);

  const row_files = result.files ?? [];
  const files = row_files
    .map(({ id, name }) => ({ id, name }))
    .filter((obj): obj is File => !!(obj.id && obj.name));
  const nextToken = result.nextPageToken;

  return [files, nextToken];
};

const getAllFiles = async (query: string) => {
  let token = undefined;
  let isFirst = true;
  let allFiles: File[] = [];

  while (token || isFirst) {
    const [paged, next]: Result = await getPagedFiles(query, token);

    allFiles = allFiles.concat(paged);
    token = next;
    isFirst = false;
  }

  return allFiles;
};

export const getAllFolders = async (parent?: string) =>
  getAllFiles(
    `mimeType = 'application/vnd.google-apps.folder' and parents in '${
      parent ?? "root"
    }'`
  );

export const getAllMusics = async (parent?: string) =>
  getAllFiles(
    `mimeType contains 'audio/' and parents in '${parent ?? "root"}'`
  );

/**
 * get file data at file id from google drive
 * @param fileId google drive file id
 * @returns file data string
 */
export const downloadFile = async (fileId: string) => {
  console.log("download file data", "ID", fileId);
  try {
    const response = await gapi.client.drive.files.get({
      fileId,
      alt: "media",
    });

    return response.body;
  } catch (error) {
    console.error(error);
    return "";
  }
};

/**
 * initialize gapi client and if succeed update status
 */
export const loadAndInit = (
  updateSigninStatus: (isSignedIn: boolean) => void,
  onError?: (error: unknown) => void
) => {
  gapi.load("client:auth2", async () => {
    try {
      console.log("initialize client");
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      // Handle the initial sign-in state.
      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      console.log("signed in:", isSignedIn);
      updateSigninStatus(isSignedIn);
    } catch (error) {
      console.error("error:", error);
      onError && onError(error);
    }
  });
};

/**
 * sign in to google
 */
export const signIn = () => gapi.auth2.getAuthInstance().signIn();

/**
 * sign out to google
 */
export const signOut = () => gapi.auth2.getAuthInstance().signOut();

export const getAccessToken = () => gapi.client.getToken().access_token;
