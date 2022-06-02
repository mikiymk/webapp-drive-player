export type GoogleFile = {
  readonly id: string;
  readonly name: string;
};

export type GoogleFileList = {
  readonly files: { readonly id: string; readonly name: string }[];
  readonly nextPageToken?: string;
};
