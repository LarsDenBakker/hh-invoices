import { LitElement, html, css, customElement, property } from 'lit-element';
import '@material/mwc-button';
import { authManager } from '../gapi/authManager';

@customElement('hh-header')
class HhHeader extends LitElement {
  @property() signedIn = false;

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();

    this.signedIn = authManager.signedIn;
    authManager.addEventListener('auth-status-changed', e => {
      this.signedIn = authManager.signedIn;
    });
  }

  render() {
    return html`
      <header>
        <mwc-button @click=${this.changeAuth}>
          ${this.signedIn ? 'Log out' : 'Log in'}
        </mwc-button>
      </header>
    `;
  }

  private changeAuth() {
    if (this.signedIn) {
      authManager.logout();
    } else {
      authManager.login();
    }
  }
}
