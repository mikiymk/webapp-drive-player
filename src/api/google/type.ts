export interface GoogleFile {
  readonly id: string;
  readonly name: string;
}

export interface GoogleFileList {
  readonly files: { readonly id: string; readonly name: string }[];
  readonly nextPageToken?: string;
}
