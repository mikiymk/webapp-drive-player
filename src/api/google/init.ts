import { PopupCodeClient } from "./client/code-client";
import { CLIENT_ID, SCOPES } from "./key";

export const initClient = () => {
  return new PopupCodeClient({
    clientId: CLIENT_ID,
    scope: SCOPES,
  });
};
