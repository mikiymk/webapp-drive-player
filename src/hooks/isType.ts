export const isStr = (obj: unknown) => {
  if (typeof obj === "string") return obj;
  return undefined;
};

export const isStrStrict = (obj: unknown) => {
  if (typeof obj === "string") return obj;
  throw new Error("expected string but " + typeof obj + ":" + obj);
};

export const isNum = (obj: unknown) => {
  if (typeof obj === "number") return obj;
  return undefined;
};

export const isArr = (obj: unknown) => {
  if (typeof obj === "string") {
    const json = JSON.parse(obj);
    if (Array.isArray(json)) return json;
  }
  return undefined;
};

export const isBlob = (obj: unknown) => {
  if (typeof obj === "object" && obj instanceof Uint8Array) return obj;
  return undefined;
};
