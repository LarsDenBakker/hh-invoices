import gapi from './gapi';
import { CLIENT_ID, API_KEY, API_SCOPES } from './config';
import { EventTargetShim } from '../utils';

const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];

class AuthManager extends EventTargetShim {
  signedIn = false;

  async initialize() {
    console.log('initializing AuthManager');
    await new Promise(r => gapi.load('client:auth2', r));
    await gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: API_SCOPES,
    });

    gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn => {
      this.signedIn = signedIn;
      this.notifyAuthChanged();
    });

    this.signedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
    this.notifyAuthChanged();
  }

  notifyAuthChanged() {
    this.dispatchEvent(new Event('auth-status-changed'));
  }

  async login() {
    await gapi.auth2.getAuthInstance().signIn();
    console.log('Logged in');
  }

  async logout() {
    await gapi.auth2.getAuthInstance().signOut();
    console.log('Logged out');
  }
}

export const authManager = new AuthManager();
