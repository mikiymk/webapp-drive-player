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

  resolve: ((result: authResult) => void) | undefined;
  reject: ((error: unknown) => void) | undefined;

  constructor(option: TokenClientOption) {
    this.authUrl = "https://accounts.google.com/o/oauth2/auth";
    this.option = {
      clientId: option.clientId,
      scope: option.scope,
    };
    this.authID = undefined;
    this.isSettedListener = false;
  }

  requestAccessToken(): Promise<authResult> {
    if (this.resolve) return Promise.reject("duplicate request is ignored");
    const client = this;
    const promise = new Promise<authResult>((resolve, reject) => {
      client.resolve = value => resolve(value);
      client.reject = reason => reject(reason);
    });
    setEventListener(this);
    setRedirectUri(this, this.option);
    openWindow(getUrlQuery(this.authUrl, this.option));
    return promise;
  }
}

const setEventListener = function (tokenClient: TokenClient) {
  if (tokenClient.isSettedListener) return;
  tokenClient.isSettedListener = true;
  window.addEventListener(
    "message",
    function (event) {
      try {
        console.log(event);

        if (event.data) {
          const params = JSON.parse(event.data).params;
          console.log(params);
          if (
            params &&
            tokenClient.authID &&
            params.id === tokenClient.authID &&
            params.clientId === tokenClient.option.clientId &&
            "authResult" === params.type
          ) {
            tokenClient.authID = undefined;
            tokenClient.resolve && tokenClient.resolve(params.authResult);
            tokenClient.resolve = undefined;
            tokenClient.reject = undefined;
          }
        }
      } catch (error) {
        tokenClient.reject && tokenClient.reject(error);
        tokenClient.resolve = undefined;
        tokenClient.reject = undefined;
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
  pushQuery(queryArray, "prompt", "");
  pushQuery(queryArray, "response_type", "token");
  pushQuery(queryArray, "include_granted_scopes", "true");
  pushQuery(queryArray, "enable_serial_consent", "true");

  const query = url + "?" + queryArray.join("&");
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
