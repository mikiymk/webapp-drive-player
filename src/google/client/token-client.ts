/* eslint-disable camelcase */

import { boolToStr, co, lp, mp, tl, uniqueKey } from "./common";

import type { AuthClient } from "./common";

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

export class TokenClient implements AuthClient {
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
