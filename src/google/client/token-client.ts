/* eslint-disable camelcase */
export default 1;

type ClientType = "code" | "token";
type PromptType = "" | "none" | "consent" | "select_account";

type BaseResponse = {
  state: string;
  error: string;
  error_description: string;
  error_uri: string;
};

type CodeResponse = {
  code: number;
  scope: string;

  state: string;
  error: string;
  error_description: string;
  error_uri: string;
};

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

type BaseClientConfig = {
  auth_url?: string;
  client_id: string;
  scope: string;

  enable_serial_consent?: boolean | undefined;
  hint?: string | undefined;
  hosted_domain?: string | undefined;

  include_granted_scopes?: boolean | undefined;
};

type CodeClientConfig = BaseClientConfig & {
  callback?: ((a: CodeResponse) => void) | undefined;
  redirect_uri?: string | undefined;
  state?: string | undefined;

  ux_mode?: "popup" | "redirect" | undefined;
  select_account?: boolean | undefined;
};

type TokenClientConfig = BaseClientConfig & {
  callback: (a: TokenResponse) => void;
  prompt?: PromptType | undefined;

  state?: string | undefined;
};

type InternalTokenClientConfig = {
  client_id: string;
  scope: string;
  hint?: string | undefined;
  state?: string | undefined;
  hosted_domain?: string | undefined;
  include_granted_scopes?: boolean | undefined;
  enable_serial_consent?: boolean | undefined;
  prompt?: PromptType | undefined;
};

type OverridableTokenClientConfig = {
  prompt?: PromptType | undefined;
  enable_serial_consent?: boolean | undefined;
  hint?: string | undefined;
  state?: string | undefined;

  scope?: string | undefined;
  include_granted_scopes?: boolean | undefined;
};

const ul = {};

class vl {
  g: string;
  constructor(a: string) {
    this.g = (ul === ul && a) || "";
  }
  fa = true;

  Z() {
    return this.g;
  }
}

const np = new vl("g_auth_code_window");
const pp = new vl("g_auth_token_window");

abstract class AbstractClient {
  i: string;
  g: string | undefined;
  h: ClientType;
  m: boolean;

  constructor(a: ClientType, b: BaseClientConfig) {
    this.i = b.auth_url || "https://accounts.google.com/o/oauth2/auth";
    this.g = undefined;
    this.h = a;
    this.m = false;
  }

  abstract l(a: BaseResponse): void;
}

export class CodeClient extends AbstractClient {
  Ba: "popup" | "redirect";
  callback: ((a: CodeResponse) => void) | undefined;
  j: CodeClientConfig;

  constructor(a: CodeClientConfig) {
    super("code", a);
    this.callback = a.callback;
    this.j = goCode(a);

    let b: "popup" | "redirect";
    c: switch (a.ux_mode) {
      case "redirect":
        b = "redirect";
        break c;
      default:
        b = "popup";
    }
    this.Ba = b;
  }

  l(a: CodeResponse) {
    this.callback && this.callback.call(this, a);
  }

  requestCode() {
    const a = this.j;
    if ("redirect" === this.Ba) {
      const x = Xk(eo(this.h, this.i, a));
      window.location.assign(Rk(x));
    } else {
      lp(this);
      mp(this, a);
      tl(eo(this.h, this.i, a), np);
    }
  }
}

export class TokenClient extends AbstractClient {
  j: InternalTokenClientConfig;
  callback: ((a: TokenResponse) => void) | undefined;

  constructor(a: TokenClientConfig) {
    super("token", a);
    this.j = goToken(a);

    this.callback = a.callback;
  }

  l(a: TokenResponse) {
    this.callback && this.callback.call(this, a);
  }

  requestAccessToken(a?: OverridableTokenClientConfig) {
    let b = this.j;
    a = a || {};
    b = goToken({
      client_id: b.client_id,
      scope: void 0 === a.scope ? b.scope : a.scope,
      prompt: void 0 === a.prompt ? b.prompt : a.prompt,
      hint: void 0 === a.hint ? b.hint : a.hint,
      state: void 0 === a.state ? b.state : a.state,
      hosted_domain: b.hosted_domain,
      include_granted_scopes:
        void 0 === a.include_granted_scopes
          ? b.include_granted_scopes
          : a.include_granted_scopes,
      enable_serial_consent:
        void 0 === a.enable_serial_consent
          ? b.enable_serial_consent
          : a.enable_serial_consent,
    });
    lp(this);
    mp(this, b);
    tl(eo(this.h, this.i, b), pp);
  }
}

const goCode = function (b: CodeClientConfig): CodeClientConfig {
  if (!b.client_id) throw new Error("Missing required parameter client_id.");
  if (!b.scope) throw new Error("Missing required parameter scope.");
  const c: CodeClientConfig = {
    client_id: b.client_id,
    scope: b.scope,
    hint: b.hint,
    state: b.state,
    hosted_domain: b.hosted_domain,
    include_granted_scopes: b.include_granted_scopes,
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

const goToken = function (
  b: InternalTokenClientConfig
): InternalTokenClientConfig {
  if (!b.client_id) throw new Error("Missing required parameter client_id.");
  if (!b.scope) throw new Error("Missing required parameter scope.");
  return {
    client_id: b.client_id,
    scope: b.scope,
    hint: b.hint,
    state: b.state,
    hosted_domain: b.hosted_domain,
    include_granted_scopes: b.include_granted_scopes,
    enable_serial_consent: b.enable_serial_consent,
    prompt: b.prompt,
  };
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

const ab = {};

class D {
  g: string;

  constructor(a: string, b: Record<string, never>) {
    this.g = b === ab ? a : "";
  }
}

const bb = new D("about:invalid#zClosurez", ab);

const Xk = function (a: string) {
  const b = df;

  for (let c = 0; c < b.length; ++c) {
    const d = b[c];
    if (d instanceof ld && d.Vc(a)) {
      return new D(a, ab);
    }
  }

  return bb;
};

const co = function (a: string[], b: string, c?: string | undefined) {
  c && a.push(b + "=" + encodeURIComponent(c.trim()));
};

const eo = function (
  a: ClientType,
  b: string,
  c: CodeClientConfig | InternalTokenClientConfig
): string {
  const d = c.client_id,
    e = c.scope,
    f = "code" === a ? "code" : "token";
  let g, h;
  if ("code" === a) {
    g = "offline";
    h = c.select_account ? "select_account consent" : "consent";
  } else if (void 0 === c.prompt) {
    h = "select_account";
  } else if (c.prompt) {
    h = c.prompt;
  }

  a = c.redirect_uri;
  let k, m, n, p, t;
  if (c.hint) k = c.hint;
  if (c.state) m = c.state;
  if (c.hosted_domain) n = c.hosted_domain;
  if (void 0 !== c.include_granted_scopes) p = c.include_granted_scopes;
  if (void 0 !== c.enable_serial_consent) t = c.enable_serial_consent;
  const cc: string[] = [];
  co(cc, "gsiwebsdk", "3");
  co(cc, "client_id", d);
  co(cc, "scope", e);
  co(cc, "redirect_uri", a);
  co(cc, "prompt", h);
  co(cc, "login_hint", k);
  co(cc, "state", m);
  co(cc, "access_type", g);
  co(cc, "hd", n);
  co(cc, "response_type", f);
  co(cc, "include_granted_scopes", !1 === p ? "false" : "true");
  co(cc, "enable_serial_consent", !1 === t ? "false" : "true");
  return b + "?" + cc.join("&");
};

const oe = function (a: D) {
  return a instanceof D && a.constructor === D ? a.g : "type_error:SafeUrl";
};

const cf = (() => {
  try {
    new URL("s://g");
    return true;
  } catch {
    return false;
  }
})();

const Rk = function (a: D) {
  if (a instanceof D) {
    return oe(a);
  }
  let b;
  if (cf) {
    let c;
    try {
      c = new URL(a);
    } catch (c) {
      return a;
    }
    b = c.protocol;
  } else {
    {
      const c = document.createElement("a");
      try {
        c.href = a;
      } catch (c) {
        return a;
      }
      b = -1 !== [":", ""].indexOf(c.protocol) ? "https:" : c.protocol;
    }
  }
  return "javascript:" === b ? "about:invalid" : a;
};

const lp = function (a: AbstractClient) {
  if (a.m) return;
  a.m = true;
  window.addEventListener(
    "message",
    function (b) {
      try {
        if (!b.data) return;
        const c = JSON.parse(b.data).params;
        if (!c) return;
        if (!(a.g && c.id === a.g)) return;
        if (c.clientId !== a.j.client_id) return;
        if ("authResult" !== c.type) return;
        a.g = void 0;
        a.l(c.authResult);
      } catch (d) {
        console.log(d);
      }
    },
    false
  );
};

const mp = function (a: AbstractClient, b: CodeClientConfig) {
  a.g = "auth" + Math.floor(1e6 * Math.random() + 1);
  let c = location.protocol;
  const d = location.host;
  const e = c.indexOf(":");
  if (0 < e) {
    c = c.substring(0, e);
  }

  b.redirect_uri = ["storagerelay://", c, "/", d, "?", "id=" + a.g].join("");
};

const Sk = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
const sl = /^data:(.*);base64,[a-z0-9+/]+=*$/i;

const tl = function (a: string, b: vl) {
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
  const g = a;
  if (!(g instanceof D)) {
    const h = "object" === typeof g && g.fa ? g.Z() : String(g);
    if (Sk.test(h)) {
      i = new D(h, ab);
    } else {
      const j = String(h).replace(/(%0A|%0D)/g, "");
      i = j.match(sl) ? new D(j, ab) : null;
    }
  }
  const f = b.Z();
  const e = window.open(Rk(i || bb), f, k);
  if (!e || e.closed || "undefined" === typeof e.closed) {
    return null;
  }
  e.focus();
  return e;
};
