import { LitElement, html, css, customElement, property } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-top-app-bar-fixed';
import { authManager } from '../gapi/authManager';
import { when } from '../utils';

@customElement('hh-header')
class HhHeader extends LitElement {
  @property() signedIn = false;
  @property() initialized = false;

  static styles = css`
    :host {
      display: block;
      position: fixed;
      z-index: 100;
      top: 0;
      left: 0;
    }

    .auth-button {
      --mdc-theme-primary: white;
    }
  `;

  render() {
    return html`
      <mwc-top-app-bar-fixed>
        <div slot="title">Handen in het Haar</div>

        ${when(
          this.initialized && this.signedIn,
          () => html`
            <mwc-button
              slot="actionItems"
              class="auth-button"
              label="Log out"
              outlined
              @click=${this.changeAuth}
            >
            </mwc-button>
          `,
        )}
      </mwc-top-app-bar-fixed>
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
