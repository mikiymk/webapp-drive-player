import { TokenClient } from "./TokenClient";
import { CLIENT_ID, SCOPES } from "./key";

export const initClient = () => {
  return new TokenClient({
    clientId: CLIENT_ID,
    scope: SCOPES,
  });
};
