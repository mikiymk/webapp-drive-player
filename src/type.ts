export type File = {
    name: string,
    id: string,
    link: string
};

export type AudioController = {
    play: (link: string) => Promise<void>,
    isPlaying: () => boolean,
}