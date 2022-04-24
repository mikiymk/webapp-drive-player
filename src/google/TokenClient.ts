type TokenClientOption = {
  clientId: string;
  scope: string;

  redirectUri?: string;
};

export type authResult = {
  access_token: string;
  expires_in: number;
};

export class TokenClient {
  authUrl: string;
  option: TokenClientOption;

  authID: string | undefined;
  isSettedListener: boolean;

  callback: (result: authResult) => void;

  constructor(
    option: TokenClientOption & { callback: (result: authResult) => void }
  ) {
    this.authUrl = "https://accounts.google.com/o/oauth2/auth";
    this.option = {
      clientId: option.clientId,
      scope: option.scope,
    };
    this.authID = undefined;
    this.isSettedListener = false;

    this.callback = option.callback;
  }

  requestAccessToken() {
    setEventListener(this);
    setRedirectUri(this, this.option);
    openWindow(getUrlQuery(this.authUrl, this.option));
  }
}

const setEventListener = function (tokenClient: TokenClient) {
  if (tokenClient.isSettedListener) return;
  tokenClient.isSettedListener = true;
  window.addEventListener(
    "message",
    function (b) {
      console.log("onmessage", b, JSON.parse(b.data));
      if (b.data) {
        const c = JSON.parse(b.data).params;
        if (
          c &&
          tokenClient.authID &&
          c.id === tokenClient.authID &&
          c.clientId === tokenClient.option.clientId &&
          "authResult" === c.type
        ) {
          tokenClient.authID = undefined;
          tokenClient.callback(c.authResult);
        }
      }
    },
    false
  );
};

const setRedirectUri = function (
  tokenClient: TokenClient,
  option: TokenClientOption
) {
  tokenClient.authID = "auth" + Math.floor(1e6 * Math.random() + 1);
  const i = location.protocol.indexOf(":");
  const protocol =
    0 < i ? location.protocol.substring(0, i) : location.protocol;
  option.redirectUri = `storagerelay://${protocol}/${location.host}?id=${tokenClient.authID}`;
  console.log("seturi", option.redirectUri);
};

const pushQuery = function (arr: string[], key: string, value?: string) {
  value && arr.push(key + "=" + encodeURIComponent(value.trim()));
};

const getUrlQuery = function (url: string, option: TokenClientOption) {
  const queryArray: string[] = [];
  pushQuery(queryArray, "gsiwebsdk", "3");
  pushQuery(queryArray, "client_id", option.clientId);
  pushQuery(queryArray, "scope", option.scope);
  pushQuery(queryArray, "redirect_uri", option.redirectUri);
  pushQuery(queryArray, "prompt", "select_account");
  pushQuery(queryArray, "response_type", "token");
  pushQuery(queryArray, "include_granted_scopes", "true");
  pushQuery(queryArray, "enable_serial_consent", "true");

  const query = url + "?" + queryArray.join("&");
  console.log("urlquery", query);
  return query;
};

const openWindow = function (authUrl: string) {
  const wwidth = Math.min(500, screen.width - 40);
  const wheight = Math.min(550, screen.height - 40);
  const features = [
    "toolbar=no",
    "location=no",
    "directories=no",
    "status=no",
    "menubar=no",
    "scrollbars=no",
    "resizable=no",
    "copyhistory=no",
    "width=" + wwidth,
    "height=" + wheight,
    "top=" + (screen.height / 2 - wheight / 2),
    "left=" + (screen.width / 2 - wwidth / 2),
  ].join();

  const authWin = window.open(authUrl, "g_auth_token_window", features);
  if (!authWin || authWin.closed || "undefined" === typeof authWin.closed)
    return null;
  authWin.focus();
  return authWin;
};
