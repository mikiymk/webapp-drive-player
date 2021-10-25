import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from "./key";

/**
 * initialize gapi client and if succeed update status
 * @param updateSigninStatus on update signin status, called
 * @param onError if error when sign in, called
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
