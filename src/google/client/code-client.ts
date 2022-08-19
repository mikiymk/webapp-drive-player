/* eslint-disable camelcase */

import { boolToStr, co, lp, mp, tl, uniqueKey, Xk } from "./common";

import type { AuthClient } from "./common";

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
  include_granted_scopes: undefined;
  enable_serial_consent: boolean | undefined;
  select_account: boolean | undefined;
  ux_mode: "popup" | "redirect" | undefined;
  redirect_uri?: string;
};

const np = "g_auth_code_window";

export class CodeClient implements AuthClient {
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
      a.redirect_uri = mp(this.g);
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
    include_granted_scopes: undefined,
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
  co(cc, "include_granted_scopes", boolToStr(c.include_granted_scopes));
  co(cc, "enable_serial_consent", boolToStr(c.enable_serial_consent));
  return b + "?" + cc.join("&");
};
