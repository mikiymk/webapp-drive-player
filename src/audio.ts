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

        this.onEnded();
    }

    addMusic(music: File) {
        console.log("add music", music.name);

        this.list.push(music);

        if (this.list.length === 1) {
            this.setIndex(0);
            this.play();
        } else if (this.list.length === 2) {
            this.setMusicToNextPlaying();
        }
    }

    setMusicToPlaying() {
        if (this.list.length < 1) {
            return;
        }

        this.playing.src = this.list[this.index].link;
        this.playing.currentTime = 0;
        this.playing.load();

        console.log("set playing", this.playing.src);
    }

    setMusicToNextPlaying() {
        if (this.list.length < 2) {
            return;
        } else if (this.index + 1 === this.list.length && !this.isLoop) {
            this.nextPlaying.src = "";
        } else {
            this.nextPlaying.src =
                this.list[this.calcIndex(this.index, 1)].link;
        }

        this.nextPlaying.currentTime = 0;
        this.nextPlaying.load();

        console.log("set next playing", this.nextPlaying.src);
    }

    skipToNext() {
        console.log("skip next");

        if (this.nextPlaying.currentSrc.length === 0) {
            const index = this.calcIndex(this.index, 1);
            this.setIndex(index);
            return;
        }

        const tmp = this.playing;
        this.playing = this.nextPlaying;
        this.nextPlaying = tmp;

        this.index = this.calcIndex(this.index, 1);
        this.playing.currentTime = 0;
        this.setMusicToNextPlaying();
    }

    skipTo(move: number) {
        console.log("skip", move);

        if (move === 1) {
            this.skipToNext();
            return;
        }
        const index = this.calcIndex(this.index, move);
        this.setIndex(index);
    }

    setIndex(index: number) {
        console.log("set index", index);

        this.index = this.calcIndex(index, 0);
        this.setMusicToPlaying();
        this.setMusicToNextPlaying();
    }

    play() {
        console.log("playing");

        if (this.playing.currentSrc.length === 0) {
            this.setMusicToPlaying();
        }
        this.playing.play();
    }

    pause() {
        console.log("pausing");

        this.playing.pause();
    }

    seek(time: number) {
        console.log("seeking");

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

    onEnded() {
        const listener = () => {
            console.log("play ended");
            this.skipToNext();
            this.play();
        };

        this.playing.addEventListener("ended", listener);
        this.nextPlaying.addEventListener("ended", listener);
    }
}
