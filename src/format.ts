import { AudioController } from "type";

export const formatTime = (time: number): string => {
    const hour = Math.floor(time / 3600).toString();
    const minute = Math.floor(time % 3600 / 60).toString().padStart(2, '0');
    const second = Math.floor(time % 60).toString().padStart(2, '0');
    const millisecond = Math.round(time % 1 * 1000).toString().padStart(3, '0');

    if (hour !== '0') {
        return `${hour}:${minute}:${second}.${millisecond}`;
    } else if (minute !== '00') {
        return `${minute}:${second}.${millisecond}`;
    } else {
        return `${second}.${millisecond}`;
    }
}

class PlayQueue {
    controller: AudioController;

    queue: string[];

    constructor(controller: AudioController, initQueue?: string[]) {
        this.controller = controller;
        this.queue = initQueue ?? [];
    }

    enqueue(link: string) {
        this.queue.push(link);
        if (!this.controller.isPlaying()) {
            this.play_next();
        }
    }

    play_next() {
        const link = this.queue.shift();
        if (link) {
            this.controller.play(link);
        }
    }
}