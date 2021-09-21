import React from 'react';
import { loadAndInit, getFiles, signOut, signIn } from './api';
import { File, PropPlay } from './type';
import { formatTime } from './format';

/**
 * react component root.
 */
export class MusicPlayer extends React.Component<{}, {
    isSignedIn: boolean,
    files: File[],
    preText: string,
    audio: HTMLAudioElement,
    nowPlayingList: File[],
    nowPlayingIndex: number,
}> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isSignedIn: false,
            files: [],
            preText: '',
            audio: new Audio(),
            nowPlayingList: [],
            nowPlayingIndex: 0,
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
        this.state.audio.addEventListener('ended', () => this.playNext());
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
            const file = state.nowPlayingList[state.nowPlayingIndex];
            console.log('play start', file);
            state.audio.src = file.link;
            state.audio.currentTime = 0;
            return state;
        });
        this.setPlaying(true);
    }

    playNext() {
        const index = this.state.nowPlayingIndex;
        const length = this.state.nowPlayingList.length;

        let nextIndex = 0;
        if (index + 1 === length) {
            nextIndex = 0;
        } else {
            nextIndex = index + 1;
        }

        this.setNowPlayingIndex(nextIndex);
        this.play();
    }

    playPrev() {
        const index = this.state.nowPlayingIndex;
        const length = this.state.nowPlayingList.length;

        let prevIndex = 0;
        if (index === 0) {
            prevIndex = length - 1;
        } else {
            prevIndex = index - 1;
        }

        this.setNowPlayingIndex(prevIndex);
        this.play();
    }

    addNowPlaying(file: File) {
        const pushAndPlay = this.state.nowPlayingList.length === 0;

        this.setState({
            ...this.state,
            nowPlayingList: [...this.state.nowPlayingList, file]
        });

        if (pushAndPlay) {
            this.setNowPlayingIndex(0);
            this.play();
        }
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
            <MusicList files={this.state.files} play={(file) => this.addNowPlaying(file)} />
            <NowPlayingList list={this.state.nowPlayingList} index={this.state.nowPlayingIndex} />
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
    name: string,
    duration: number,
    currentTime: number,
    paused: boolean,
    seek: (time: number) => void,
    play: () => void,
    pause: () => void,
}> = ({ name, duration, currentTime, paused, seek, play, pause }) => {
    console.log('render Playing Info');

    const durationText = formatTime(duration || 0);
    const currentTimeText = formatTime(currentTime || 0);

    return <div>
        {name}
        <PlayPauseButton isPaused={paused} play={play} pause={pause} />
        <SeekBar duration={duration} time={currentTime} seek={seek} />
        {currentTimeText}/{durationText}
    </div>;
}

const PlayPauseButton: React.FC<{
    isPaused: boolean,
    play: () => void,
    pause: () => void,
}> = ({ isPaused, play, pause }) => {
    console.log('render Play Pause Button');

    if (isPaused) {
        return <button onClick={play}>play</button>;
    } else {
        return <button onClick={pause}>pause</button>;
    }
}

const SeekBar: React.FC<{
    duration: number,
    time: number,
    seek: (time: number) => void,
}> = ({ duration, time, seek }) => {

    duration ||= 0;
    time ||= 0;

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
const MusicList: React.FC<{ files: File[] } & PropPlay> = ({ files, play }) => {
    console.log('render Music List');
    if (files.length == 0) {
        return <div>No files</div>
    }
    const listitems = files.map((file) => <MusicListItem key={file.id} {...file} play={play} />);
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
const MusicListItem: React.FC<File & PropPlay> = ({ play, name, id, link }) => {
    const playing = () => {
        play({ name, id, link })
    };
    return <li>
        {name}({id})
        <button onClick={playing}>play</button>
    </li>;
}

const NowPlayingList: React.FC<{ list: File[], index: number, }> = ({ list, index }) => {
    const listItem = list.map((value, itemIndex) =>
        <NowPlayingItem key={itemIndex} {...value} isPlayingNow={index === itemIndex} />);
    return <div>
        Now Playing:
        <ul>{listItem}</ul>
    </div>
}

const NowPlayingItem: React.FC<File & { isPlayingNow: boolean }> = ({ isPlayingNow, name }) => {
    return <li>
        {isPlayingNow ? 'playing' : ''}:{name}
    </li>
}
