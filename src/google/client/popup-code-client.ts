/* eslint-disable camelcase */

import {
  boolToStr,
  pushIfDefined,
  addMessageEventListener,
  getRedirectUri,
  openAuthWindow,
  uniqueKey,
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

type PopupCodeClientConfig = {
  client_id: string;
  scope: string;

  redirect_uri?: string;
  callback: (response: CodeResponse) => void;

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

const codeTarget = "g_auth_code_window";

export class PopupCodeClient implements AuthClient {
  authUniqueId: string | undefined;
  isMessageEventListenerAdded: boolean;
  callback: (response: CodeResponse) => void;
  query: CodeClientQuery;

  constructor(config: PopupCodeClientConfig) {
    this.authUniqueId = undefined;
    this.isMessageEventListenerAdded = false;
    this.callback = config.callback;
    this.query = normalize(config);
  }

  onMessage(response: CodeResponse) {
    this.callback(response);
  }

  requestCode() {
    const query = this.query;

    addMessageEventListener(this);

    this.authUniqueId = uniqueKey();
    query.redirect_uri = getRedirectUri(this.authUniqueId);
    openAuthWindow(buildAuthUrl(query), codeTarget);
  }
}

const normalize = function (config: PopupCodeClientConfig): CodeClientQuery {
  return {
    client_id: config.client_id,
    scope: config.scope,
    hint: config.hint,
    state: config.state,
    hosted_domain: config.hosted_domain,
    include_granted_scopes: undefined,
    enable_serial_consent: config.enable_serial_consent,
    select_account: config.select_account,
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
