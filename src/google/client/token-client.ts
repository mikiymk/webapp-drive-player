/* eslint-disable camelcase */

import {
  boolToStr,
  addMessageEventListener,
  getRedirectUri,
  openAuthWindow,
  uniqueKey,
  buildQueriedUri,
} from "./common";

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
  callback: (this: TokenClient, response: TokenResponse) => void;
  scope: string;
  prompt?: PromptType;
  enable_serial_consent?: boolean;
  hint?: string;
  hosted_domain?: string;
  state?: string;
};

type TokenClientQuery = {
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

const tokenTarget = "g_auth_token_window";

export class TokenClient implements AuthClient {
  authUniqueId: string | undefined;
  isListens: boolean;
  query: TokenClientQuery;
  callback: (this: TokenClient, response: TokenResponse) => void;

  constructor(config: TokenClientConfig) {
    this.authUniqueId = undefined;
    this.isListens = false;
    this.query = normalize(config);

    this.callback = config.callback;
  }

  onMessage(response: TokenResponse) {
    this.callback.call(this, response);
  }

  requestAccessToken(config?: OverridableTokenClientConfig) {
    let query = this.query;
    config = config || {};
    query = {
      client_id: query.client_id,
      scope: query.scope,
      prompt: void 0 === config.prompt ? query.prompt : config.prompt,
      hint: void 0 === config.hint ? query.hint : config.hint,
      state: void 0 === config.state ? query.state : config.state,
      hosted_domain: query.hosted_domain,
      include_granted_scopes: query.include_granted_scopes,
      enable_serial_consent:
        void 0 === config.enable_serial_consent
          ? query.enable_serial_consent
          : config.enable_serial_consent,
    };

    addMessageEventListener(this);
    this.authUniqueId = uniqueKey();

    query.redirect_uri = getRedirectUri(this.authUniqueId);
    openAuthWindow(buildAuthUrl(query), tokenTarget);
  }
}

const normalize = (config: TokenClientConfig): TokenClientQuery => ({
  client_id: config.client_id,
  scope: config.scope,
  hint: config.hint,
  state: config.state,
  hosted_domain: config.hosted_domain,
  include_granted_scopes: undefined,
  enable_serial_consent: config.enable_serial_consent,
  prompt: config.prompt,
});

const buildAuthUrl = (query: TokenClientQuery): string =>
  buildQueriedUri([
    ["gsiwebsdk", "3"],
    ["client_id", query.client_id],
    ["scope", query.scope],
    ["redirect_uri", query.redirect_uri],
    ["prompt", query.prompt ?? "select_account"],
    ["login_hint", query.hint],
    ["state", query.state],
    ["access_type", undefined],
    ["hd", query.hosted_domain],
    ["response_type", "token"],
    ["include_granted_scopes", boolToStr(query.include_granted_scopes)],
    ["enable_serial_consent", boolToStr(query.enable_serial_consent)],
  ]);
