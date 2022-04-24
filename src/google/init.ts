import { CLIENT_ID, SCOPES } from "./key";
import { authResult, TokenClient } from "./TokenClient";

export const initClient = (callback: (response: authResult) => void) => {
  return new TokenClient({
    // eslint-disable-next-line camelcase
    clientId: CLIENT_ID,
    scope: SCOPES,
    callback: response => {
      callback(response);
    },
  });
};
