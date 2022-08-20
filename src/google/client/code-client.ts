/* eslint-disable camelcase */

import {
  boolToStr,
  addMessageEventListener,
  getRedirectUri,
  openAuthWindow,
  uniqueKey,
  buildQueriedUri,
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

type PopupCodeClientQuery = {
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

type RedirectCodeClientQuery = {
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
  isListens: boolean;
  callback: (response: CodeResponse) => void;
  query: PopupCodeClientQuery;

  constructor(config: PopupCodeClientConfig) {
    this.authUniqueId = undefined;
    this.isListens = false;
    this.callback = config.callback;
    this.query = normalizePopup(config);
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

export class RedirectCodeClient {
  query: RedirectCodeClientQuery;

  constructor(config: RedirectCodeClientConfig) {
    this.query = normalizeRedirect(config);
  }

  requestCode() {
    window.location.assign(validateRedirectUrl(buildAuthUrl(this.query)));
  }
}

const normalizePopup = (
  config: PopupCodeClientConfig
): PopupCodeClientQuery => ({
  client_id: config.client_id,
  scope: config.scope,
  hint: config.hint,
  state: config.state,
  hosted_domain: config.hosted_domain,
  include_granted_scopes: undefined,
  enable_serial_consent: config.enable_serial_consent,
  select_account: config.select_account,
});

const normalizeRedirect = (
  config: RedirectCodeClientConfig
): RedirectCodeClientQuery => ({
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
});

const buildAuthUrl = (query: PopupCodeClientQuery): string =>
  buildQueriedUri([
    ["gsiwebsdk", "3"],
    ["client_id", query.client_id],
    ["scope", query.scope],
    ["redirect_uri", query.redirect_uri],
    ["prompt", query.select_account ? "select_account consent" : "consent"],
    ["login_hint", query.hint],
    ["state", query.state],
    ["access_type", "offline"],
    ["hd", query.hosted_domain],
    ["response_type", "code"],
    ["include_granted_scopes", boolToStr(query.include_granted_scopes)],
    ["enable_serial_consent", boolToStr(query.enable_serial_consent)],
  ]);
