/* eslint-disable camelcase */

import {
  boolToStr,
  pushIfDefined,
  addMessageEventListener,
  getRedirectUri,
  openAuthWindow,
  uniqueKey,
  validateRedirectUrl,
} from "./common";

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
  callback?: (this: CodeClient, response: CodeResponse) => void;

  state?: string;
  enable_serial_consent?: boolean;
  hint?: string;
  hosted_domain?: string;
  ux_mode?: "popup" | "redirect";
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
  ux_mode: "popup" | "redirect" | undefined;
  redirect_uri?: string;
};

const codeTarget = "g_auth_code_window";

export class CodeClient implements AuthClient {
  authUniqueId: string | undefined;
  isMessageEventListenerAdded: boolean;
  uxMode: "popup" | "redirect";
  callback: ((this: CodeClient, response: CodeResponse) => void) | undefined;
  query: CodeClientQuery;

  constructor(config: CodeClientConfig) {
    this.authUniqueId = undefined;
    this.isMessageEventListenerAdded = false;
    this.callback = config.callback;
    this.query = normalize(config);

    this.uxMode = config.ux_mode ?? "popup";
  }

  onMessage(response: CodeResponse) {
    this.callback && this.callback.call(this, response);
  }

  requestCode() {
    const query = this.query;
    if ("redirect" === this.uxMode) {
      const url = validateRedirectUrl(buildAuthUrl(query));
      window.location.assign(url);
    } else {
      addMessageEventListener(this);

      this.authUniqueId = uniqueKey();
      query.redirect_uri = getRedirectUri(this.authUniqueId);
      openAuthWindow(buildAuthUrl(query), codeTarget);
    }
  }
}

const normalize = function (config: CodeClientConfig): CodeClientQuery {
  const query: CodeClientQuery = {
    client_id: config.client_id,
    scope: config.scope,
    hint: config.hint,
    state: config.state,
    hosted_domain: config.hosted_domain,
    include_granted_scopes: undefined,
    enable_serial_consent: config.enable_serial_consent,

    select_account: config.select_account,
    ux_mode: config.ux_mode,
  };

  if ("redirect" === query.ux_mode) {
    query.redirect_uri =
      config.redirect_uri ||
      location.protocol + "//" + location.host + location.pathname;
  }

  return query;
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
