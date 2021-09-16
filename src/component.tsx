import React from 'react';
import { loadAndInit, getFiles, signOut, signIn } from './api';
import { File } from './type';
import { formatTime } from './format';

/**
 * react component root.
 */
export class MusicPlayer extends React.Component<{}, {
    isSignedIn: boolean, files: File[], preText: string, audio: HTMLAudioElement,
}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isSignedIn: false,
            files: [],
            preText: '',
            audio: new Audio(),
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
            getFiles()
                .then(files => this.setState({ files }));
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

    play(link: string) {
        this.setState((state) => {
            console.log('play start', link);
            state.audio.src = link;
            state.audio.currentTime = 0;
            state.audio.play().catch(console.log);
            return state;
        })
    }

    render() {
        console.log('render Music Player');
        return <div>
            <PlayingInfo name={''} audio={this.state.audio} />
            <AuthButton isSignedIn={this.state.isSignedIn} />
            <MusicList files={this.state.files} play={(link) => this.play(link)} />
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
const PlayingInfo: React.FC<{ name: string, audio: HTMLAudioElement }> = ({ name, audio }) => {
    console.log('render Playing Info');

    const duration = formatTime(audio.duration || 0);
    const currentTime = formatTime(audio.currentTime || 0);

    const play = () => { audio.play(); };
    const pause = () => { audio.pause(); };


    return <div>
        {name}
        <PlayPauseButton isPaused={audio.paused} play={play} pause={pause} />
        <SeekBar duration={audio.duration} />{currentTime}/{duration}
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

const SeekBar: React.FC<{ duration: number }> = ({ duration }) => {
    return <input
        type="range"
        min="0"
        max={duration * 1000}
        onChange={console.log}></input>
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
