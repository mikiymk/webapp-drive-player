/* eslint-disable camelcase */

type PromptType = "" | "none" | "consent" | "select_account";

type TokenResponse = {
  access_token: string;
  expires_in: number;
  hd: string;
  prompt: PromptType;
  token_type: string;
  scopes: string;

  state: string;
  error: string;
  error_description: string;
  error_uri: string;
};

type TokenClientConfig = {
  client_id: string;
  callback: (a: TokenResponse) => void;
  scope: string;
  prompt?: PromptType;
  enable_serial_consent?: boolean;
  hint?: string;
  hosted_domain?: string;
  state?: string;
};

type NormalizedTokenClientConfig = {
  client_id: string;
  scope: string;
  prompt: PromptType | undefined;
  enable_serial_consent: boolean | undefined;
  include_granted_scopes: undefined;
  hint: string | undefined;
  hosted_domain: string | undefined;
  state: string | undefined;

  redirect_uri?: string;
};

type OverridableTokenClientConfig = {
  prompt?: PromptType;
  enable_serial_consent?: boolean;
  hint?: string;
  state?: string;
};

const pp = "g_auth_token_window";

export class TokenClient {
  i: string;
  g: string | undefined;
  h: "token";
  m: boolean;
  j: NormalizedTokenClientConfig;
  callback: ((a: TokenResponse) => void) | undefined;

  constructor(a: TokenClientConfig) {
    this.i = "https://accounts.google.com/o/oauth2/auth";
    this.g = undefined;
    this.h = "token";
    this.m = false;
    this.j = normalize(a);

    this.callback = a.callback;
  }

  l(a: TokenResponse) {
    this.callback && this.callback.call(this, a);
  }

  requestAccessToken(a?: OverridableTokenClientConfig) {
    let b = this.j;
    a = a || {};
    b = {
      client_id: b.client_id,
      scope: b.scope,
      prompt: void 0 === a.prompt ? b.prompt : a.prompt,
      hint: void 0 === a.hint ? b.hint : a.hint,
      state: void 0 === a.state ? b.state : a.state,
      hosted_domain: b.hosted_domain,
      include_granted_scopes: b.include_granted_scopes,
      enable_serial_consent:
        void 0 === a.enable_serial_consent
          ? b.enable_serial_consent
          : a.enable_serial_consent,
    };
    lp(this);
    this.g = uniqueKey();

    b.redirect_uri = mp(this.g);
    tl(eo(this.i, b), pp);
  }
}

const normalize = function (b: TokenClientConfig): NormalizedTokenClientConfig {
  if (!b.client_id) throw new Error("Missing required parameter client_id.");
  if (!b.scope) throw new Error("Missing required parameter scope.");
  return {
    client_id: b.client_id,
    scope: b.scope,
    hint: b.hint,
    state: b.state,
    hosted_domain: b.hosted_domain,
    include_granted_scopes: undefined,
    enable_serial_consent: b.enable_serial_consent,
    prompt: b.prompt,
  };
};

const bb = "about:invalid#zClosurez";

const co = function (a: string[], b: string, c?: string | undefined) {
  c && a.push(b + "=" + encodeURIComponent(c.trim()));
};

const boolToStr = (a: boolean | undefined) => (false === a ? "false" : "true");

const eo = function (b: string, c: NormalizedTokenClientConfig): string {
  const cc: string[] = [];
  co(cc, "gsiwebsdk", "3");
  co(cc, "client_id", c.client_id);
  co(cc, "scope", c.scope);
  co(cc, "redirect_uri", c.redirect_uri);
  co(cc, "prompt", c.prompt ?? "select_account");
  co(cc, "login_hint", c.hint);
  co(cc, "state", c.state);
  co(cc, "access_type", undefined);
  co(cc, "hd", c.hosted_domain);
  co(cc, "response_type", "token");
  co(cc, "include_granted_scopes", boolToStr(c.include_granted_scopes));
  co(cc, "enable_serial_consent", boolToStr(c.enable_serial_consent));
  return b + "?" + cc.join("&");
};

const lp = function (a: TokenClient) {
  if (a.m) return;
  a.m = true;
  window.addEventListener(
    "message",
    function (b) {
      try {
        if (!b.data) return;
        const c = JSON.parse(b.data).params;
        if (!c) return;
        if (!a.g || c.id !== a.g) return;
        if (c.clientId !== a.j.client_id) return;
        if ("authResult" !== c.type) return;
        a.g = undefined;
        a.l(c.authResult);
      } catch (d) {
        console.log(d);
      }
    },
    false
  );
};

const uniqueKey = () => "auth" + Math.floor(1e6 * Math.random() + 1);

const mp = function (a: string) {
  let c = location.protocol;
  const d = location.host;
  const e = c.indexOf(":");
  if (0 < e) {
    c = c.substring(0, e);
  }

  return ["storagerelay://", c, "/", d, "?", "id=" + a].join("");
};

const Sk = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
const sl = /^data:(.*);base64,[a-z0-9+/]+=*$/i;

const tl = function (a: string, b: string) {
  const c = Math.min(500, screen.width - 40);
  const d = Math.min(550, screen.height - 40);
  const k = [
    "toolbar=no",
    "location=no",
    "directories=no",
    "status=no",
    "menubar=no",
    "scrollbars=no",
    "resizable=no",
    "copyhistory=no",
    "width=" + c,
    "height=" + d,
    "top=" + (screen.height / 2 - d / 2),
    "left=" + (screen.width / 2 - c / 2),
  ].join();

  let i;
  if (Sk.test(a)) {
    i = a;
  } else {
    const j = String(a).replace(/(%0A|%0D)/g, "");
    i = j.match(sl) ? j : null;
  }

  const e = window.open(i || bb, b, k);
  if (!e || e.closed || "undefined" === typeof e.closed) {
    return null;
  }
  e.focus();
  return e;
};
