import { PopupCodeClient } from "./client/code-client";

const CLIENT_ID =
  "820614082295-i9n9mthosbeammp24u81e3isqgbavku0.apps.googleusercontent.com";

const SCOPES =
  "https://www.googleapis.com/auth/drive.appdata " +
  "https://www.googleapis.com/auth/drive.readonly " +
  "https://www.googleapis.com/auth/drive.metadata.readonly";

export const initClient = () => {
  return new PopupCodeClient({
    clientId: CLIENT_ID,
    scope: SCOPES,
  });
};
