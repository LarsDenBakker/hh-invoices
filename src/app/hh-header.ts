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
    header {
      display: block;
      position: fixed;
      z-index: 100;
      top: 0;
      left: 0;
      width: 100%;
      height: 64px;
      background-color: var(--mdc-theme-primary);
    }

    .header-content {
      display: flex;
      height: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      width: 100%;
      height: auto;
      max-width: 400px;
    }

    pwa-install {
      margin-right: 8px;
    }

    .auth-button {
      flex-shrink: 0;
      margin-left: 8px;
      --mdc-theme-primary: #6200ee;
    }

    @media (max-width: 480px) {
      .auth-button {
        font-size: 10px !important;
      }
    }
  `;

  render() {
    return html`
      <header>
        <div class="header-content">
          <div>
            <img class="logo" src="/assets/logo.png" />
          </div>

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
        </div>
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
