/* eslint-disable camelcase */

type CodeResponse = {
  code: number;
  scope: string;

  state: string;
  error: string;
  error_description: string;
  error_uri: string;
};

type CodeClientConfig = {
  client_id: string;
  scope: string;

  redirect_uri?: string;
  callback?: (a: CodeResponse) => void;

  state?: string;
  enable_serial_consent?: boolean;
  hint?: string;
  hosted_domain?: string;
  auth_url?: string;

  ux_mode?: "popup" | "redirect";

  select_account?: boolean;
};

type NormalizedCodeClientConfig = {
  client_id: string;
  scope: string;
  hint: string | undefined;
  state: string | undefined;
  hosted_domain: string | undefined;
  // include_granted_scopes: b.include_granted_scopes,
  enable_serial_consent: boolean | undefined;
  select_account: boolean | undefined;
  ux_mode: "popup" | "redirect" | undefined;
  redirect_uri?: string;
};

const np = "g_auth_code_window";

export class CodeClient {
  i: string;
  g: string | undefined;
  h: "code";
  m: boolean;
  Ba: "popup" | "redirect";
  callback: ((a: CodeResponse) => void) | undefined;
  j: NormalizedCodeClientConfig;

  constructor(a: CodeClientConfig) {
    this.i = a.auth_url || "https://accounts.google.com/o/oauth2/auth";
    this.g = undefined;
    this.h = "code";
    this.m = false;
    this.callback = a.callback;
    this.j = goCode(a);

    this.Ba = a.ux_mode ?? "popup";
  }

  l(a: CodeResponse) {
    this.callback && this.callback.call(this, a);
  }

  requestCode() {
    const a = this.j;
    if ("redirect" === this.Ba) {
      const x = Xk(eo(this.i, a));
      window.location.assign(x);
    } else {
      lp(this);

      this.g = uniqueKey();
      a.redirect_uri = mp(this);
      tl(eo(this.i, a), np);
    }
  }
}

const goCode = function (b: CodeClientConfig): NormalizedCodeClientConfig {
  if (!b.client_id) throw new Error("Missing required parameter client_id.");
  if (!b.scope) throw new Error("Missing required parameter scope.");
  const c: NormalizedCodeClientConfig = {
    client_id: b.client_id,
    scope: b.scope,
    hint: b.hint,
    state: b.state,
    hosted_domain: b.hosted_domain,
    // include_granted_scopes: b.include_granted_scopes,
    enable_serial_consent: b.enable_serial_consent,

    select_account: b.select_account,
    ux_mode: b.ux_mode,
  };

  if ("redirect" === c.ux_mode) {
    c.redirect_uri =
      b.redirect_uri ||
      location.protocol + "//" + location.host + location.pathname;
  }

  return c;
};

class ld {
  Vc: (a: string) => boolean;
  constructor(a: (a: string) => boolean) {
    this.Vc = a;
  }
}

const md = function (a: string) {
  return new ld(function (b) {
    return b.substr(0, a.length + 1).toLowerCase() === a + ":";
  });
};

const df = [
  md("data"),
  md("http"),
  md("https"),
  md("mailto"),
  md("ftp"),
  new ld(function (a) {
    return /^[^:]*([/?#]|$)/.test(a);
  }),
];

const bb = "about:invalid#zClosurez";

const Xk = function (a: string) {
  for (let c = 0; c < df.length; ++c) {
    const d = df[c];
    if (d instanceof ld && d.Vc(a)) {
      return a;
    }
  }

  return bb;
};

const co = function (a: string[], b: string, c?: string | undefined) {
  c && a.push(b + "=" + encodeURIComponent(c.trim()));
};

const boolToStr = (a: boolean | undefined) => (false === a ? "false" : "true");

const eo = function (b: string, c: NormalizedCodeClientConfig): string {
  const cc: string[] = [];
  co(cc, "gsiwebsdk", "3");
  co(cc, "client_id", c.client_id);
  co(cc, "scope", c.scope);
  co(cc, "redirect_uri", c.redirect_uri);
  co(cc, "prompt", c.select_account ? "select_account consent" : "consent");
  co(cc, "login_hint", c.hint);
  co(cc, "state", c.state);
  co(cc, "access_type", "offline");
  co(cc, "hd", c.hosted_domain);
  co(cc, "response_type", "code");
  // co(cc, "include_granted_scopes", boolToStr(c.include_granted_scopes));
  co(cc, "enable_serial_consent", boolToStr(c.enable_serial_consent));
  return b + "?" + cc.join("&");
};

const lp = function (a: CodeClient) {
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

const mp = function (a: CodeClient) {
  let c = location.protocol;
  const d = location.host;
  const e = c.indexOf(":");
  if (0 < e) {
    c = c.substring(0, e);
  }

  return ["storagerelay://", c, "/", d, "?", "id=" + a.g].join("");
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
