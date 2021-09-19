import React from 'react';
import { loadAndInit, getFiles, signOut, signIn } from './api';
import { File } from './type';
import { formatTime } from './format';

/**
 * react component root.
 */
export class MusicPlayer extends React.Component<{}, {
    isSignedIn: boolean, files: File[],
    preText: string, audio: HTMLAudioElement,
    nowPlayingList: string[], nowPlayingIndex: number | undefined,
}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isSignedIn: false,
            files: [],
            preText: '',
            audio: new Audio(),
            nowPlayingList: [],
            nowPlayingIndex: undefined,
        }
    }

    componentDidMount() {
        loadAndInit(
            (isSignedIn) => this.updateSigninStatus(isSignedIn),
            (error) => this.appendPre(JSON.stringify(error, null, 2)));

        this.state.audio.addEventListener('loadeddata', () => this.forceUpdate());
        this.state.audio.addEventListener('timeupdate', () => this.forceUpdate());
        this.state.audio.addEventListener('play', () => this.forceUpdate());
        this.state.audio.addEventListener('pause', () => this.forceUpdate());
        this.state.audio.addEventListener('ended', (event) => {
            const audio = event.target;
            if (audio instanceof HTMLAudioElement) {
                audio.currentTime = 0;
                audio.play();
            }
        });
    }

    /**
     * of sign in status, 
     * @param isSignedIn if google signed in
     */
    updateSigninStatus(isSignedIn: boolean) {
        this.setState({ isSignedIn });
        if (isSignedIn) {
            getFiles().then(files => this.setState({ files }));
        }
    }

    /**
     * message append to pre element
     * @param message append message
     */
    appendPre(message: string) {
        const preText = this.state.preText + message + '\n';
        this.setState({ preText });
    }

    play() {
        this.setState((state) => {
            const link = state.nowPlayingList[state.nowPlayingIndex ?? 0];
            console.log('play start', link);
            state.audio.src = link;
            state.audio.currentTime = 0;
            state.audio.play();
            return state;
        });
    }

    addNowPlaying(link: string) {

        this.setState((state) => {
            const pushAndPlay = state.nowPlayingList.length === 0;
            state.nowPlayingList.push(link);
            if (pushAndPlay) {
                this.setNowPlayingIndex(0);
                this.play();
            }
            return state;
        })
    }


    setNowPlayingIndex(index: number) {
        this.setState({
            ...this.state,
            nowPlayingIndex: index,
        });
    }

    setPlaying(isPlay: boolean) {
        this.setState((state) => {
            if (isPlay) {
                console.log('play start');
                state.audio.play().catch(console.log);
            } else {
                console.log('play stop');
                state.audio.pause();
            }
            return state;
        });
    }

    seek(time: number) {
        this.setState((state) => {
            console.log('seek to', time);
            state.audio.currentTime = time;
            return state;
        });
    }

    render() {
        console.log('render Music Player');
        return <div>
            <PlayingInfo name={''}
                duration={this.state.audio.duration}
                currentTime={this.state.audio.currentTime}
                paused={this.state.audio.paused}
                seek={(time) => this.seek(time)}
                play={() => this.setPlaying(true)}
                pause={() => this.setPlaying(false)} />
            <AuthButton isSignedIn={this.state.isSignedIn} />
            <MusicList files={this.state.files} play={(link) => this.addNowPlaying(link)} />
            <pre>{this.state.preText}</pre>
        </div>
    }
}

/**
 * now playing audio info view
 * @param props compontnt props
 * @param props.name play song name
 * @param props.audio play song audio element
 * @returns react render
 */
const PlayingInfo: React.FC<{
    name: string, duration: number, currentTime: number, paused: boolean,
    seek: (time: number) => void, play: () => void, pause: () => void,
}> = ({ name, duration, currentTime, paused, seek, play, pause }) => {
    console.log('render Playing Info');

    const durationText = formatTime(duration || 0);
    const currentTimeText = formatTime(currentTime || 0);

    return <div>
        {name}
        <PlayPauseButton isPaused={paused} play={play} pause={pause} />
        <SeekBar duration={duration} time={currentTime} seek={seek} />{currentTimeText}/{durationText}
    </div>;
}

const PlayPauseButton: React.FC<{ isPaused: boolean, play: () => void, pause: () => void }> = ({ isPaused, play, pause }) => {
    console.log('render Play Pause Button');

    if (isPaused) {
        return <button onClick={play}>play</button>;
    } else {
        return <button onClick={pause}>pause</button>;
    }
}

const SeekBar: React.FC<{
    duration: number, time: number, seek: (time: number) => void
}> = ({ duration, time, seek }) => {
    return <input
        type="range"
        min="0"
        max={duration * 1000}
        value={time * 1000}
        onChange={(event) => seek(parseInt(event.target.value, 10) / 1000)}></input>
}

/**
 * authorize or sign out button
 * @param props compontnt props
 * @returns react render
 */
const AuthButton: React.FC<{ isSignedIn: boolean }> = ({ isSignedIn }) => {
    console.log('render Authorize Button');
    if (isSignedIn) {
        return <button onClick={signOut}>Sign Out</button>;
    } else {
        return <button onClick={signIn}>Authorize</button>;
    }
}

/**
 * list of musics
 * @param props compontnt props
 * @returns react render
 */
const MusicList: React.FC<{ files: File[], play: (link: string) => void }> = ({ files, play }) => {
    console.log('render Music List');
    if (files.length == 0) {
        return <div>No files</div>
    }
    const listitems = files.map((file) => <MusicListItem {...file} play={play} />);
    return <div>
        Files:
        <ul>{listitems}</ul>
    </div>;
}

/**
 * item of musics list
 * @param props compontnt props
 * @returns react render
 */
const MusicListItem: React.FC<File & { play: (link: string) => void }> = ({ play, name, id, link }) => {
    const playing = () => {
        play(link)
    };
    return <li>
        {name}({id})
        <button onClick={playing}>play</button>
    </li>;
}
