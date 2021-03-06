import { css, html, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';

declare global {
  interface HTMLElementTagNameMap {
    'cards-grid-widget': CardsGridWidget;
  }
}

export class CardsGridWidget extends Nexinterface {
  static {
    this.registerAs('cards-grid-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: grid;
          grid-template-columns: repeat(auto-fit, 360px);
          justify-content: center;
          grid-auto-flow: unset;
          gap: 16px;
          padding: 16px;
        }

        @media (max-width: 640px) {
          :host {
            grid-template-columns: repeat(auto-fit, minmax(256px, 1fr));
          }
        }
      `,
    ];
  }

  override get template(): WidgetTemplate {
    return html`<slot></slot>`;
  }
}
