import {
  addMessageEventListener,
  boolToStr,
  buildQueriedUri,
  getRedirectUri,
  openAuthWindow,
  uniqueKey,
  validateRedirectUrl,
} from "./common";

import { PromiseCallBack } from "./promise-callback";

import type { AuthClient } from "./common";

interface CodeResponse {
  code: string;
  scope: string;

  state: string;
  error: string;
  error_description: string;
  error_uri: string;
}

interface PopupCodeClientConfig {
  clientId: string;
  scope: string;

  redirectUri?: string;

  state?: string;
  enableSerialConsent?: boolean;
  hint?: string;
  hostedDomain?: string;
  selectAccount?: boolean;
}

interface RedirectCodeClientConfig {
  clientId: string;
  scope: string;

  redirectUri: string;

  state?: string;
  enableSerialConsent?: boolean;
  hint?: string;
  hostedDomain?: string;
  selectAccount?: boolean;
}

interface PopupCodeClientQuery {
  clientId: string;
  scope: string;
  hint: string | undefined;
  state: string | undefined;
  hostedDomain: string | undefined;
  includeGrantedScopes: undefined;
  enableSerialConsent: boolean | undefined;
  selectAccount: boolean | undefined;
  redirectUri?: string;
}

interface RedirectCodeClientQuery {
  clientId: string;
  scope: string;
  hint: string | undefined;
  state: string | undefined;
  hostedDomain: string | undefined;
  includeGrantedScopes: undefined;
  enableSerialConsent: boolean | undefined;
  selectAccount: boolean | undefined;
  redirectUri?: string;
}

const codeTarget = "g_auth_code_window";

export class PopupCodeClient implements AuthClient {
  authUniqueId: string | undefined;
  isListens: boolean;
  query: PopupCodeClientQuery;
  promiseCallback: PromiseCallBack<CodeResponse>;

  constructor(config: PopupCodeClientConfig) {
    this.authUniqueId = undefined;
    this.isListens = false;
    this.query = normalizePopup(config);
    this.promiseCallback = new PromiseCallBack<CodeResponse>();

    console.log("new PopupCodeClient");
  }

  onMessage(response: CodeResponse) {
    this.promiseCallback.resolve(response);
  }

  requestCode() {
    console.log("start request code");
    const query = this.query;

    this.promiseCallback = new PromiseCallBack<CodeResponse>();
    addMessageEventListener(this);

    this.authUniqueId = uniqueKey();
    query.redirectUri = getRedirectUri(this.authUniqueId);
    openAuthWindow(buildAuthUrl(query), codeTarget, this.promiseCallback);

    return this.promiseCallback.promise;
  }
}

export class RedirectCodeClient {
  query: RedirectCodeClientQuery;

  constructor(config: RedirectCodeClientConfig) {
    this.query = normalizeRedirect(config);

    console.log("new RedirectCodeClient");
  }

  requestCode() {
    console.log("start request code");
    window.location.assign(validateRedirectUrl(buildAuthUrl(this.query)));
  }
}

const normalizePopup = (
  config: PopupCodeClientConfig,
): PopupCodeClientQuery => ({
  clientId: config.clientId,
  scope: config.scope,
  hint: config.hint,
  state: config.state,
  hostedDomain: config.hostedDomain,
  includeGrantedScopes: undefined,
  enableSerialConsent: config.enableSerialConsent,
  selectAccount: config.selectAccount,
});

const normalizeRedirect = (
  config: RedirectCodeClientConfig,
): RedirectCodeClientQuery => ({
  clientId: config.clientId,
  scope: config.scope,
  hint: config.hint,
  state: config.state,
  hostedDomain: config.hostedDomain,
  includeGrantedScopes: undefined,
  enableSerialConsent: config.enableSerialConsent,

  selectAccount: config.selectAccount,
  redirectUri:
    config.redirectUri ||
    `${location.protocol}//${location.host}${location.pathname}`,
});

const buildAuthUrl = (query: PopupCodeClientQuery): string =>
  buildQueriedUri([
    ["gsiwebsdk", "3"],
    ["client_id", query.clientId],
    ["scope", query.scope],
    ["redirect_uri", query.redirectUri],
    ["prompt", query.selectAccount ? "select_account consent" : "consent"],
    ["login_hint", query.hint],
    ["state", query.state],
    ["access_type", "offline"],
    ["hd", query.hostedDomain],
    ["response_type", "code"],
    ["include_granted_scopes", boolToStr(query.includeGrantedScopes)],
    ["enable_serial_consent", boolToStr(query.enableSerialConsent)],
  ]);
