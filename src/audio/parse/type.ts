export type Tags = {
  readonly title?: string | undefined;
  readonly artists?: string[] | undefined;
  readonly album?: string | undefined;
  readonly albumartist?: string | undefined;

  readonly track?: number | undefined;
  readonly trackOf?: number | undefined;
  readonly disk?: number | undefined;
  readonly diskOf?: number | undefined;
  readonly date?: string | undefined;
  readonly genre?: string[] | undefined;

  readonly picture?: ArrayBuffer | undefined;

  readonly albumsort?: string | undefined;
  readonly titlesort?: string | undefined;
  readonly artistsort?: string | undefined;
  readonly albumartistsort?: string | undefined;
};
