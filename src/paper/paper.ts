import { css, html, Nexwidget, WidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'paper-widget': PaperWidget;
  }
}

export class PaperWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          background: var(--surfaceColor);
          color: var(--onSurfaceColor);
          border-radius: 8px;
          box-sizing: border-box;
          overflow: hidden;
          box-shadow: var(--shadowLvl1);
          width: calc(100% - 32px);
          margin: 0px auto;
        }

        :host([full-width]) {
          border-radius: 0px;
          width: 100%;
        }
      `,
    ];
  }

  get template(): WidgetTemplate {
    return html`<slot></slot>`;
  }
}

PaperWidget.register('paper-widget');
