export type File = {
  name: string;
  id: string;
  link: string;
};

export type Play = {
  play: (index: number) => void;
};
