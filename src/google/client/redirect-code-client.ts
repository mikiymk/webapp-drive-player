/* eslint-disable camelcase */

import { boolToStr, pushIfDefined, validateRedirectUrl } from "./common";

type CodeResponse = {
  code: number;
  scope: string;

  state: string;
  error: string;
  error_description: string;
  error_uri: string;
};

type RedirectCodeClientConfig = {
  client_id: string;
  scope: string;

  redirect_uri: string;
  callback?: (response: CodeResponse) => void;

  state?: string;
  enable_serial_consent?: boolean;
  hint?: string;
  hosted_domain?: string;
  select_account?: boolean;
};

type CodeClientQuery = {
  client_id: string;
  scope: string;
  hint: string | undefined;
  state: string | undefined;
  hosted_domain: string | undefined;
  include_granted_scopes: undefined;
  enable_serial_consent: boolean | undefined;
  select_account: boolean | undefined;
  redirect_uri?: string;
};

export class RedirectCodeClient {
  query: CodeClientQuery;

  constructor(config: RedirectCodeClientConfig) {
    this.query = normalize(config);
  }

  requestCode() {
    window.location.assign(validateRedirectUrl(buildAuthUrl(this.query)));
  }
}

const normalize = function (config: RedirectCodeClientConfig): CodeClientQuery {
  return {
    client_id: config.client_id,
    scope: config.scope,
    hint: config.hint,
    state: config.state,
    hosted_domain: config.hosted_domain,
    include_granted_scopes: undefined,
    enable_serial_consent: config.enable_serial_consent,

    select_account: config.select_account,
    redirect_uri:
      config.redirect_uri ||
      location.protocol + "//" + location.host + location.pathname,
  };
};

const buildAuthUrl = function (query: CodeClientQuery): string {
  const queryStrings: string[] = [];
  pushIfDefined(queryStrings, "gsiwebsdk", "3");
  pushIfDefined(queryStrings, "client_id", query.client_id);
  pushIfDefined(queryStrings, "scope", query.scope);
  pushIfDefined(queryStrings, "redirect_uri", query.redirect_uri);
  pushIfDefined(
    queryStrings,
    "prompt",
    query.select_account ? "select_account consent" : "consent"
  );
  pushIfDefined(queryStrings, "login_hint", query.hint);
  pushIfDefined(queryStrings, "state", query.state);
  pushIfDefined(queryStrings, "access_type", "offline");
  pushIfDefined(queryStrings, "hd", query.hosted_domain);
  pushIfDefined(queryStrings, "response_type", "code");
  pushIfDefined(
    queryStrings,
    "include_granted_scopes",
    boolToStr(query.include_granted_scopes)
  );
  pushIfDefined(
    queryStrings,
    "enable_serial_consent",
    boolToStr(query.enable_serial_consent)
  );

  return `https://accounts.google.com/o/oauth2/auth?${queryStrings.join("&")}`;
};
