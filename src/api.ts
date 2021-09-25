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
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
].join(" ");

const GET_PAGE_SIZE = 100;

type Result = [File[], string | undefined];

const get10Files = async (token?: string) => {
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
 * get file list from google drive using gapi
 * @returns list of files
 */
export const getFiles = async (addFile: (files: File[]) => void) => {
  let token = undefined;
  let isFirst = true;

  while (token || isFirst) {
    const [files, nextToken]: Result = await get10Files(token);

    addFile(files);
    token = nextToken;
    isFirst = false;
  }
};

export const downloadFile = async (fileId: string) => {
  try {
    const response = await gapi.client.drive.files.get({
      fileId,
      fields: "files(size)",
      alt: "media",
    });

    console.log(response);
    return response.body;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export const loadAndInit = (
  updateSigninStatus: (isSignedIn: boolean) => void,
  onError?: (error: unknown) => void
) => {
  /**
   * initialize gapi client and if succeed update status
   */
  const initClient = async () => {
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
  };

  console.log("load client:auth2");
  gapi.load("client:auth2", initClient);
};

export const signIn = () => {
  console.log("sign in");
  gapi.auth2.getAuthInstance().signIn();
};
export const signOut = () => {
  console.log("sign out");
  gapi.auth2.getAuthInstance().signOut();
};
