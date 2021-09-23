import { File } from "./type";

const calcIndex = (
    index: number,
    move: number,
    length: number,
    isLoop: boolean
): number => {
    if (isLoop) {
        return (index + move) % length;
    } else {
        return Math.max(0, Math.min(length - 1, index + move));
    }
};

export class PlayingList {
    playing: HTMLAudioElement;
    nextPlaying: HTMLAudioElement;
    list: File[];
    index: number;
    history: (File | number)[];
    isLoop: boolean;

    constructor() {
        this.playing = new Audio();
        this.nextPlaying = new Audio();
        this.list = [];
        this.index = 0;
        this.history = [];
        this.isLoop = false;
    }

    addMusic(music: File) {
        this.list.push(music);
    }

    setMusicToPlaying() {
        if (this.nextPlaying.currentSrc.length === 0) {
            if (this.list.length !== 0) {
                this.playing.src = this.list[this.index].link;
            }
            this.playing.load();
        } else {
            const tmp = this.playing;
            this.playing = this.nextPlaying;
            this.nextPlaying = tmp;
        }
        this.playing.currentTime = 0;
    }

    setMusicToNextPlaying() {
        if (this.list.length < 2) {
            return;
        }
        this.nextPlaying.src =
            this.list[
                calcIndex(this.index, 1, this.list.length, this.isLoop)
            ].link;
        this.nextPlaying.load();
    }

    skipTo(move: number) {
        this.index = calcIndex(this.index, move, this.list.length, this.isLoop);
        this.setMusicToPlaying();
        this.setMusicToNextPlaying();
    }

    setIndex(index: number) {
        this.index = calcIndex(index, 0, this.list.length, this.isLoop);
    }

    setPlaying(isPlay: boolean) {
        if (isPlay) {
            this.playing.play().catch(console.log);
        } else {
            this.playing.pause();
        }
    }

    seek(time: number) {
        this.playing.currentTime = time;
    }
}
