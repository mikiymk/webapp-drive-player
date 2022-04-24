import { CLIENT_ID, SCOPES } from "./key";

export const initClient = (callback: (response: Responce) => void) => {
  return google.accounts.oauth2.initTokenClient({
    // eslint-disable-next-line camelcase
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: response => {
      callback(response);
    },
  });
};
