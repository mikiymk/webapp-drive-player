import React from 'react';
import ReactDOM from 'react-dom';
import { getFiles, loadAndInit, signIn, signOut } from './api';
import { File } from './type';

const formatTime = (time: number): string => {
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

/**
 * react component root.
 */
class MusicPlayer extends React.Component<{}, {
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
const PlayingInfo: React.FunctionComponent<{ name: string, audio: HTMLAudioElement }> = (props) => {
    console.log('render Playing Info');

    const duration = formatTime(props.audio.duration || 0);
    const currentTime = formatTime(props.audio.currentTime || 0);

    return <div>
        {props.name}
        {currentTime}/{duration}
    </div>;
}

/**
 * authorize or sign out button
 * @param props compontnt props
 * @returns react render
 */
const AuthButton: React.FunctionComponent<{ isSignedIn: boolean }> = (props) => {
    console.log('render Authorize Button');
    if (props.isSignedIn) {
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
const MusicList: React.FunctionComponent<{ files: File[], play: (link: string) => void }> = (props) => {
    console.log('render Music List');
    if (props.files.length == 0) {
        return <div>No files</div>
    }
    const listitems = props.files
        .map((file) => <MusicListItem {...file} play={props.play} />);
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
const MusicListItem: React.FunctionComponent<File & { play: (link: string) => void }> = (props) => {
    const playing = () => {
        props.play(props.link)
    };
    return <li>
        {props.name}({props.id})
        <button onClick={playing}>play</button>
    </li>;
}

ReactDOM.render(<MusicPlayer />, document.getElementById('root'));
