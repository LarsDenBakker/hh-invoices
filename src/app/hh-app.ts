import { LitElement, html, css, customElement, property } from 'lit-element';
import { authManager } from '../gapi/authManager';
import { when } from '../utils';
import './hh-header';
import './hh-invoice-overview';

@customElement('hh-app')
class HhHeader extends LitElement {
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
    if (!this.initialized) {
      return html`
        Loading...
      `;
    }

    if (this.error) {
      return html`
        <p>Something went wrong</p>
      `;
    }

    return html`
      <hh-header></hh-header>

      ${when(
        this.signedIn,
        () => html`
          <hh-invoice-overview></hh-invoice-overview>
        `,
      )}
    `;
  }
}
