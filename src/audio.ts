import { File } from "./type";

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

        this.playing.addEventListener("ended", () => this.skipToNext());
        this.nextPlaying.addEventListener("ended", () => this.skipToNext());
    }

    addMusic(music: File) {
        this.list.push(music);
    }

    setMusicToPlaying() {
        if (this.list.length < 1) {
            return;
        }

        this.playing.src = this.list[this.index].link;
        this.playing.currentTime = 0;
        this.playing.load();
    }

    setMusicToNextPlaying() {
        if (this.list.length < 2) {
            return;
        }

        this.nextPlaying.src = this.list[this.calcIndex(this.index, 1)].link;
        this.nextPlaying.currentTime = 0;
        this.nextPlaying.load();
    }

    skipToNext() {
        if (this.nextPlaying.currentSrc.length === 0) {
            const index = this.calcIndex(this.index, 1);
            this.setIndex(index);
            return;
        }
        const tmp = this.playing;
        this.playing = this.nextPlaying;
        this.nextPlaying = tmp;
        this.playing.currentTime = 0;
        this.setMusicToNextPlaying();
    }

    skipTo(move: number) {
        if (move === 1) {
            this.skipToNext();
            return;
        }
        const index = this.calcIndex(this.index, move);
        this.setIndex(index);
    }

    setIndex(index: number) {
        this.index = this.calcIndex(index, 0);
        this.setMusicToPlaying();
        this.setMusicToNextPlaying();
    }

    play() {
        if (this.playing.currentSrc.length === 0) {
            this.setMusicToPlaying();
        }
        this.playing.play();
    }

    pause() {
        this.playing.pause();
    }

    seek(time: number) {
        this.playing.currentTime = time;
    }

    calcIndex(index: number, move: number): number {
        if (this.isLoop) {
            return (index + move) % this.list.length;
        } else {
            return Math.max(0, Math.min(this.list.length - 1, index + move));
        }
    }

    onTimeUpdate(callback: () => void) {
        this.playing.addEventListener("timeupdate", callback);
        this.nextPlaying.addEventListener("timeupdate", callback);
    }
}
