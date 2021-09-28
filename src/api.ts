import { File } from "./type";

// Client ID and API key from the Developer Console
const CLIENT_ID =
  "820614082295-ob2em235vu1va9b5mhu0uhpvo299ipt7.apps.googleusercontent.com";

const API_KEY = "AIzaSyAg5BcUDni6Srv8AwwCVYXrRIHcj8E9_0E";

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = [
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
].join(" ");

const GET_PAGE_SIZE = 100;

type Result = [File[], string | undefined];

const get10Files = async (token?: string) => {
  console.log("get files list page", "token ", token);

  const response = await gapi.client.drive.files.list({
    fields: "nextPageToken, files(id, name, webContentLink)",
    pageSize: GET_PAGE_SIZE,
    pageToken: token,
    q: "mimeType contains 'audio/'",
  });

  const row_files = response.result.files ?? [];
  const files = row_files
    .map(({ id, name, webContentLink }) => ({
      id,
      name,
      link: webContentLink,
    }))
    .filter((obj): obj is File => !!(obj.id && obj.name && obj.link));
  const nextToken = response.result.nextPageToken;

  console.log(GET_PAGE_SIZE, "files", files);
  console.log("nextpage token", nextToken);

  const result: Result = [files, nextToken];
  return result;
};

/**
 * get file list from google drive use gapi
 * @returns list of files
 */
export const getFiles = async (addFile: (files: File[]) => void) => {
  console.log("get all files list");

  let token = undefined;
  let isFirst = true;

  while (token || isFirst) {
    const [files, nextToken]: Result = await get10Files(token);

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
