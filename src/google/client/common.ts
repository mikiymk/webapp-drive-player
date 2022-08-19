const validateScheme = function (scheme: string, uri: string) {
  return uri.slice(0, scheme.length + 1).toLowerCase() === scheme + ":";
};

const validSchemes = ["data", "http", "https", "mailto", "ftp"];

export const validateRedirectUrl = function (uri: string) {
  for (const scheme of validSchemes) {
    if (validateScheme(scheme, uri)) {
      return uri;
    }
  }

  if (/^[^:]*([/?#]|$)/.test(uri)) {
    return uri;
  }

  return invalidUrl;
};

export const pushIfDefined = function (
  array: string[],
  key: string,
  value?: string | undefined
) {
  value && array.push(key + "=" + encodeURIComponent(value.trim()));
};

export const boolToStr = (bool: boolean | undefined) =>
  false === bool ? "false" : "true";

export const uniqueKey = () => {
  return "auth" + Math.floor(1e6 * Math.random() + 1);
};

export const getRedirectUri = function (a: string) {
  let c = location.protocol;
  const d = location.host;
  const e = c.indexOf(":");
  if (0 < e) {
    c = c.substring(0, e);
  }

  return ["storagerelay://", c, "/", d, "?", "id=" + a].join("");
};

const validUri = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
const validDataUri = /^data:(.*);base64,[a-z0-9+/]+=*$/i;
const invalidUrl = "about:invalid#zClosurez";

const validatePopUpUrl = (url: string) => {
  if (validUri.test(url)) {
    return url;
  } else {
    const noSpaceUrl = String(url).replace(/(%0A|%0D)/g, "");
    return noSpaceUrl.match(validDataUri) ? noSpaceUrl : invalidUrl;
  }
};

export const openAuthWindow = function (url: string, target: string) {
  const width = Math.min(500, screen.width - 40);
  const height = Math.min(550, screen.height - 40);
  const features = [
    "toolbar=no",
    "location=no",
    "directories=no",
    "status=no",
    "menubar=no",
    "scrollbars=no",
    "resizable=no",
    "copyhistory=no",
    "width=" + width,
    "height=" + height,
    "top=" + (screen.height / 2 - height / 2),
    "left=" + (screen.width / 2 - width / 2),
  ].join();

  const authWindow = window.open(validatePopUpUrl(url), target, features);
  if (!authWindow || authWindow.closed) {
    return null;
  }
  authWindow.focus();
  return authWindow;
};

type BaseResponse = {
  state: string;
  error: string;
  error_description: string;
  error_uri: string;
};

export interface AuthClient {
  isMessageEventListenerAdded: boolean;
  authUniqueId: string | undefined;
  query: { client_id: string };

  onMessage(a: BaseResponse): void;
}

export const addMessageEventListener = function (client: AuthClient) {
  if (client.isMessageEventListenerAdded) return;
  client.isMessageEventListenerAdded = true;
  window.addEventListener(
    "message",
    function (event) {
      try {
        if (!event.data) return;
        const params = JSON.parse(event.data).params;
        if (!params) return;
        if (!client.authUniqueId || params.id !== client.authUniqueId) return;
        if (params.clientId !== client.query.client_id) return;
        if ("authResult" !== params.type) return;
        client.authUniqueId = undefined;
        client.onMessage(params.authResult);
      } catch (error) {
        console.log(error);
      }
    },
    false
  );
};
