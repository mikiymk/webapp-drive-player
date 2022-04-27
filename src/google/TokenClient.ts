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
  isSetted: boolean;

  resolve: ((value: authResult) => void) | undefined;
  reject: ((reason: unknown) => void) | undefined;

  constructor(option: TokenClientOption) {
    this.authUrl = "https://accounts.google.com/o/oauth2/auth";
    this.option = {
      clientId: option.clientId,
      scope: option.scope,
    };
    this.authID = undefined;
    this.isSetted = false;
  }

  private onMessage(event: { data: string }) {
    try {
      if (event.data) {
        const params = JSON.parse(event.data).params;
        if (
          params &&
          this.authID &&
          params.id === this.authID &&
          params.clientId === this.option.clientId &&
          "authResult" === params.type
        ) {
          this.authID = undefined;
          this.resolve && this.resolve(params.authResult);
        }
      }
    } catch (error) {
      this.reject && this.reject(error);
    } finally {
      this.reject && this.reject(event);
      this.resolve = undefined;
      this.reject = undefined;
    }
  }

  requestAccessToken(): Promise<authResult> {
    if (this.resolve) return Promise.reject("duplicate request is ignored");

    const promise = Promise.resolve(this).then(
      client =>
        new Promise<authResult>((resolve, reject) => {
          client.resolve = value => resolve(value);
          client.reject = reason => reject(reason);
        })
    );

    if (!this.isSetted) {
      this.isSetted = true;
      window.addEventListener("message", event => this.onMessage(event), false);
    }

    this.authID = createAuthID();
    this.option.redirectUri = generateRedirectUri(this.authID);
    const url = generateUrl(this.authUrl, this.option);

    openWindow(url);
    return promise;
  }
}

const createAuthID = () => "auth" + Math.floor(1e6 * Math.random() + 1);

const generateRedirectUri = (authID: string) => {
  const i = location.protocol.indexOf(":");
  const protocol =
    0 < i ? location.protocol.substring(0, i) : location.protocol;
  return `storagerelay://${protocol}/${location.host}?id=${authID}`;
};

const param = (key: string, value?: string) => {
  return value && key + "=" + encodeURIComponent(value.trim());
};

const generateUrl = function (url: string, option: TokenClientOption) {
  const querys = [
    param("gsiwebsdk", "3"),
    param("client_id", option.clientId),
    param("scope", option.scope),
    param("redirect_uri", option.redirectUri),
    param("prompt", ""),
    param("response_type", "token"),
    param("include_granted_scopes", "true"),
    param("enable_serial_consent", "true"),
  ];

  return url + "?" + querys.filter(v => v).join("&");
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
  ].join(",");

  const authWin = window.open(authUrl, "auth_window", features);
  if (!authWin || authWin.closed || "undefined" === typeof authWin.closed)
    return null;
  authWin.focus();
  return authWin;
};
