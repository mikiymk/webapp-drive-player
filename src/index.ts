
// Client ID and API key from the Developer Console
const CLIENT_ID = '820614082295-6sqmb2cr2pgs2j7l1mjh00bv7rbc2t2c.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAg5BcUDni6Srv8AwwCVYXrRIHcj8E9_0E';

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

/**
 * Print files.
 */
async function listFiles() {
    appendPre('Files:');

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

    if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            const file = files[i];
            appendMusic(file.name ?? '', file.id ?? '');
        }
    } else {
        appendPre('No files found.');
    }
}

handleClientLoad();