import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from "./api_keys";
import { File } from "./type";

const GET_PAGE_SIZE = 100;

type Result = [File[], string | undefined];

const getPagedFiles = async (parent: string, token?: string) => {
  const response = await gapi.client.drive.files.list({
    fields: "nextPageToken, files(id, name)",
    pageSize: GET_PAGE_SIZE,
    pageToken: token,
    q: `mimeType contains 'audio/' and parents in '${parent}'`,
  });

  const row_files = response.result.files ?? [];
  const files = row_files
    .map(({ id, name }) => ({ id, name }))
    .filter((obj): obj is File => !!(obj.id && obj.name));
  const nextToken = response.result.nextPageToken;

  const result: Result = [files, nextToken];
  return result;
};

export const getAllFiles = async (
  addFile: (files: File[]) => void,
  parent?: string
) => {
  const constParent = parent ?? "root";
  let token = undefined;
  let isFirst = true;

  while (token || isFirst) {
    const [files, nextToken]: Result = await getPagedFiles(constParent, token);

    addFile(files);
    token = nextToken;
    isFirst = false;
  }
};

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
