import { css, html, Nexwidget, NexwidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'card-grid-widget': CardsGridWidget;
  }
}

export class CardsGridWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
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
            grid-template-columns: repeat(auto-fit, minmax(248px, 1fr));
          }
        }
      `,
    ];
  }

  get template(): NexwidgetTemplate {
    return html`<slot></slot>`;
  }
}

CardsGridWidget.register('card-grid-widget');
