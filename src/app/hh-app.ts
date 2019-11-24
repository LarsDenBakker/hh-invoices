import { LitElement, html, css, customElement, property } from 'lit-element';
import { authManager } from '../gapi/authManager';
import { when } from '../utils';
import './hh-header';
import './hh-invoice-overview';

@customElement('hh-app')
class HhHeader extends LitElement {
  static styles = css`
    :host {
      text-align: center;
      font-size: 20px;
    }

    main {
      margin-top: 88px;
    }
  `;

  @property() signedIn = false;
  @property() initialized = false;
  @property() error = false;

  constructor() {
    super();

    this.init();
  }

  async init() {
    try {
      authManager.addEventListener('auth-status-changed', e => {
        this.signedIn = authManager.signedIn;
      });
      await authManager.initialize();
      this.signedIn = authManager.signedIn;
    } catch (error) {
      this.error = error;
      console.error(error);
    } finally {
      this.initialized = true;
    }
  }

  render() {
    if (this.error) {
      return html`
        <p class="text">Something went wrong</p>
      `;
    }

    return html`
      <hh-header .initialized=${this.initialized} .signedIn=${this.signedIn}></hh-header>

      <main>
        ${when(
          !this.initialized,
          () =>
            html`
              <p class="text">Loading...</p>
            `,
        )}
        ${when(
          this.initialized && !this.signedIn,
          () => html`
            <p>
              Log in to get started
            </p>
            <mwc-button class="login" outlined raised @click=${authManager.login}>
              Log in
            </mwc-button>
          `,
        )}
        ${when(
          this.initialized && this.signedIn,
          () => html`
            <hh-invoice-overview></hh-invoice-overview>
          `,
        )}
      </main>
    `;
  }
}
