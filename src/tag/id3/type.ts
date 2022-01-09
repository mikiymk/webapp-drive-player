export interface TagInfo {
  v1?: ID3v1 | ID3v11;
  v2?: ID3v2;
}

export interface ID3v1 {
  version: "1";
  title: string;
  artist: string;
  album: string;
  year: number;
  comment: string;
  genre: number;
}

export interface ID3v11 {
  version: "1.1";
  title: string;
  artist: string;
  album: string;
  track: number;
  year: number;
  comment: string;
  genre: number;
}

export interface ID3v2 {
  version: "2.2.0" | "2.3.0" | "2.4.0";
  tags: ID3v2Frame[];
}

export interface ID3v2Frame {
  id: string;
  data: any;
}
