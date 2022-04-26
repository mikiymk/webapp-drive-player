import { CLIENT_ID, SCOPES } from "./key";
import { TokenClient } from "./TokenClient";

export const initClient = () => {
  return new TokenClient({
    // eslint-disable-next-line camelcase
    clientId: CLIENT_ID,
    scope: SCOPES,
  });
};
