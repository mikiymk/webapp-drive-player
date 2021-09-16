import exp from 'constants';
import { File } from './type';

// Client ID and API key from the Developer Console
const CLIENT_ID_1 = '820614082295-6sqmb2cr2pgs2j7l1mjh00bv7rbc2t2c.apps.googleusercontent.com';
const CLIENT_ID_2 = '820614082295-ob2em235vu1va9b5mhu0uhpvo299ipt7.apps.googleusercontent.com';

const API_KEY = 'AIzaSyAg5BcUDni6Srv8AwwCVYXrRIHcj8E9_0E';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
].join(' ');


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

    console.log(row_files, files, nextToken);

    return [files, nextToken];
};

/**
 * get file list from google drive using gapi
 * @returns list of files
 */
export const getFiles = async () => {
    let [allFiles, token]: [File[], string | undefined] = await get10Files();

    while (token) {
        let [files, nextToken]: [File[], string | undefined] = await get10Files(token);

        allFiles = allFiles.concat(files);
        token = nextToken;
    }
    console.log('files', allFiles);
    return allFiles;
}

export const loadAndInit = (updateSigninStatus: (isSignedIn: boolean) => void, onError?: (error: unknown) => void) => {

    /**
    * initialize gapi client and if succeed update status
    */
    const initClient = async () => {
        try {
            console.log('initialize client');
            await gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID_2,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            });

            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn => updateSigninStatus(signedIn));
            // Handle the initial sign-in state.
            const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
            console.log('signed in:', isSignedIn);
            updateSigninStatus(isSignedIn);
        } catch (error) {
            console.error('error:', error);
            onError && onError(error);
        }
    }

    console.log('load client:auth2');
    gapi.load('client:auth2', initClient);
}

export const signIn = () => {
    console.log('sign in');
    gapi.auth2.getAuthInstance().signIn();
};
export const signOut = () => {
    console.log('sign out');
    gapi.auth2.getAuthInstance().signOut();
};