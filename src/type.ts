export type File = {
    name: string,
    id: string,
    link: string
};

export type PropPlay = {
    play: (file: File) => void,
}