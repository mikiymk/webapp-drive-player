import { CLIENT_ID, SCOPES } from "./key";
import { TokenClient } from "./TokenClient";

export const initClient = () => {
  return new TokenClient({
    clientId: CLIENT_ID,
    scope: SCOPES,
  });
};
