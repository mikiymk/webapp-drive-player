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
        .filter((obj): obj is File => !!(obj.id ?? obj.name ?? obj.link ?? false));
    const nextToken = response.result.nextPageToken;

    return [files, nextToken];
};

/**
 * get file list from google drive using gapi
 * @returns list of files
 */
async function getFiles() {
    const request: {
        fields: string,
        q: string,
        pageToken: undefined | string,
    } = {
        'fields': '*',
        'q': "mimeType contains 'audio/'",
        'pageToken': undefined,
    };

    let files: gapi.client.drive.File[] = [];
    let hasNextPage = true;

    while (hasNextPage) {
        const response = await gapi.client.drive.files.list(request);
        console.log(response.result);
        if (response.result.files) {
            files = files.concat(response.result.files);
        }
        if (response.result.nextPageToken) {
            request.pageToken = response.result.nextPageToken;
            hasNextPage = true;
        } else {
            hasNextPage = false;
        }
    }
    return files;
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
        gapi.load('client:auth2', () => this.initClient());
    }

    /**
     * initialize gapi client and if succeed update status
     */
    async initClient() {
        try {
            await gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            });

            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn => this.updateSigninStatus(signedIn));
            // Handle the initial sign-in state.
            this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        } catch (error) {
            this.appendPre(JSON.stringify(error, null, 2));
        }
    }

    /**
     * of sign in status, 
     * @param isSignedIn if google signed in
     */
    updateSigninStatus(isSignedIn: boolean) {
        this.setState({ isSignedIn });
        getFiles().then((value) => {
            const files = value.map((file) => ({
                name: file.name ?? '',
                id: file.id ?? '',
                link: file.webContentLink ?? '',
            }));
            this.setState({ files })
        })
    }

    /**
     * message append to pre element
     * @param message append message
     */
    appendPre(message: string) {
        this.setState({ preText: this.state.preText + message + '\n' });
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

    const duration = props.audio.duration;

    const hour = Math.floor(duration / 3600);
    const minute = Math.floor(duration % 3600 / 60);
    const second = Math.floor(duration % 60);
    const millisecond = Math.round(duration % 1 * 1000);

    return <div>
        {props.name}
        {hour}:{minute}:{second}.{millisecond}
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
