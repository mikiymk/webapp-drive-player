import React from "react";
import ReactDOM from "react-dom";
import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from "./api";

type File = { name: string, id: string, link: string };

const get10Files = async (token?: string): Promise<[File[], string | undefined]> => {
    const response = await gapi.client.drive.files.list({
        'fields': 'nextPageToken, files(id, name, webContentLink)',
        'pageSize': 10,
        'pageToken': token,
        'q': "mimeType contains 'audio/'",
    });

    const row_files = response.result.files ?? [];
    const files = row_files
        .map(({ id, name, webContentLink }) => ({ id, name, link: webContentLink }))
        .filter((obj): obj is File => !!(obj.id && obj.name && obj.link));
    const nextToken = response.result.nextPageToken;

    return [files, nextToken];
};

/**
 * get file list from google drive using gapi
 * @returns list of files
 */
async function getFiles() {
    let allFiles: File[] = [];
    let token: string | undefined = undefined;

    while (token) {
        let [files, nextToken]: [File[], string | undefined] = await get10Files(token);

        allFiles = allFiles.concat(files);
        token = nextToken;
    }
    return allFiles;
}

/**
    * initialize gapi client and if succeed update status
    */
const initClient = (updateSigninStatus: (isSignedIn: boolean) => void, onError?: (error: unknown) => void) => async () => {
    try {
        await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        });

        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn => updateSigninStatus(signedIn));
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    } catch (error) {
        onError && onError(error);
    }
}

const formatTime = (time: number): string => {
    const hour = Math.floor(time / 3600).toString();
    const minute = Math.floor(time % 3600 / 60).toString().padStart(2, '0');
    const second = Math.floor(time % 60).toString().padStart(2, '0');
    const millisecond = Math.round(time % 1 * 1000).toString().padStart(3, '0');

    if (hour !== '0') {
        return `${hour}:${minute}:${second}:${millisecond}`;
    } else if (minute !== '00') {
        return `${minute}:${second}:${millisecond}`;
    } else {
        return `${second}:${millisecond}`;
    }
}

/**
 * react component root.
 */
class MusicPlayer extends React.Component<{}, { isSignedIn: boolean, files: File[], preText: string }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isSignedIn: false,
            files: [],
            preText: "",
        }
    }

    componentDidMount() {
        gapi.load('client:auth2', initClient(
            (isSignedIn) => this.updateSigninStatus(isSignedIn),
            (error) => this.appendPre(JSON.stringify(error, null, 2))));
    }

    /**
     * of sign in status, 
     * @param isSignedIn if google signed in
     */
    updateSigninStatus(isSignedIn: boolean) {
        this.setState({ isSignedIn });
        getFiles()
            .then(files => this.setState({ files }));
    }

    /**
     * message append to pre element
     * @param message append message
     */
    appendPre(message: string) {
        const preText = this.state.preText + message + '\n';
        this.setState({ preText });
    }

    render() {
        return <div>
            <PlayingInfo name={""} audio={new Audio()} />
            <AuthButton isSignedIn={this.state.isSignedIn} />
            <MusicList files={this.state.files} />
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

    const duration = props.audio.duration || 0;
    const timeText = formatTime(duration);

    return <div>
        {props.name}
        {timeText}
    </div>;
}

/**
 * authorize or sign out button
 * @param props compontnt props
 * @returns react render
 */
const AuthButton: React.FunctionComponent<{ isSignedIn: boolean }> = (props) => {

    const onClickAuthorize = () => { gapi.auth2.getAuthInstance().signIn(); };
    const onClickSignOut = () => { gapi.auth2.getAuthInstance().signOut(); };

    if (props.isSignedIn) {
        return <button onClick={onClickSignOut}>Sign Out</button>;
    } else {
        return <button onClick={onClickAuthorize}>Authorize</button>;
    }
}

/**
 * list of musics
 * @param props compontnt props
 * @returns react render
 */
const MusicList: React.FunctionComponent<{ files: File[] }> = (props) => {
    if (props.files.length == 0) {
        return <div>No files</div>
    }
    const listitems = props.files.map(
        ({ name, id, link }) => <MusicListItem name={name} id={id} link={link} />);
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
const MusicListItem: React.FunctionComponent<File> = (props) => {
    const playing = () => {
        console.log(props.link);
        let audio = new Audio(props.link);
        audio.play();
    };
    return <li>
        {props.name}({props.id})
        <button onClick={playing}>play</button>
    </li>;
}

ReactDOM.render(<MusicPlayer />, document.getElementById('root'));
