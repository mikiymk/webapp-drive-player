import React from "react";
import ReactDOM from "react-dom";
import { API_KEY, CLIENT_ID } from "./api";

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
].join(' ');

const authorizeButton = document.getElementById('authorize_button')!;
const signoutButton = document.getElementById('signout_button')!;

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
async function initClient() {
    try {
        await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        });

        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    } catch (error) {
        appendPre(JSON.stringify(error, null, 2));
    }
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn: boolean) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listFiles();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event: MouseEvent) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event: MouseEvent) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message: string) {
    const pre = document.getElementById('content')!;
    const textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function appendMusic(name: string, id: string) {
    const ul = document.getElementById('musics')!;
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.appendChild(document.createTextNode('play'));
    button.addEventListener('click', async event => {
        console.log(`playing ${name}`);
        const responce = await gapi.client.drive.files.get({
            'fileId': id,
            'fields': '*',
        });
        console.log(responce.result.webContentLink);
        let audio = new Audio(responce.result.webContentLink);
        audio.play();
    });

    li.appendChild(document.createTextNode(`${name} (${id})`));
    li.appendChild(button);

    ul.appendChild(li);
}

async function getFiles() {
    const request: {
        fields: string,
        q: string,
        pageToken: undefined | string
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
 * Print files.
 */
async function listFiles() {
    appendPre('Files:');

    const files = await getFiles();

    if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            const file = files[i];
            appendMusic(file.name ?? '', file.id ?? '');
        }
    } else {
        appendPre('No files found.');
    }
}

class MusicPlayer extends React.Component<{}, { isSignedIn: boolean, files: { name: string, id: string, link: string }[], preText: string }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isSignedIn: false,
            files: [],
            preText: "",
        }
    }

    componentDidMount() {
        gapi.load('client:auth2', this.initClient);
    }

    async initClient() {
        try {
            await gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            });

            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
            // Handle the initial sign-in state.
            this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        } catch (error) {
            this.appendPre(JSON.stringify(error, null, 2));
        }
    }

    updateSigninStatus(isSignedIn: boolean) {
        this.setState({ isSignedIn });
    }

    appendPre(message: string) {
        this.setState({ preText: this.state.preText + message + '\n' });
    }

    render() {
        return <div>
            <AuthButton isSignedIn={this.state.isSignedIn} />
            <MusicList files={this.state.files} />
            <pre>{this.state.preText}</pre>
        </div>
    }
}

const AuthButton: React.FunctionComponent<{ isSignedIn: boolean }> = (props) => {
    if (props.isSignedIn) {
        return <button onClick={() => gapi.auth2.getAuthInstance().signIn()}>Authorize</button>;
    } else {
        return <button onClick={() => gapi.auth2.getAuthInstance().signOut()}>Sign Out</button>;
    }
}

const MusicList: React.FunctionComponent<{ files: { name: string, id: string, link: string }[] }> = (props) => {
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

const MusicListItem: React.FunctionComponent<{ name: string, id: string, link: string }> = (props) => {
    const playing: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        console.log(props.link);
        let audio = new Audio(props.link);
        audio.play();
    };
    return <li>
        {props.name}({props.id})
        <button onClick={playing}>play</button>
    </li>;
}

handleClientLoad();

ReactDOM.render(<MusicPlayer />, document.getElementById('root'));