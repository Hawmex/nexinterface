import { css, html, Nexwidget, WidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'menu-container-widget': MenuContainerWidget;
  }
}

export class MenuContainerWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          width: 100%;
          display: grid;
          grid-auto-flow: row;
          padding: 8px;
          gap: 8px;
          box-sizing: border-box;
          background: var(--surfaceColor);
        }
      `,
    ];
  }

  get template(): WidgetTemplate {
    return html`<slot></slot>`;
  }
}

MenuContainerWidget.register('menu-container-widget');
