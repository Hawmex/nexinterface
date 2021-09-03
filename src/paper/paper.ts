import { css, html, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';

declare global {
  interface HTMLElementTagNameMap {
    'paper-widget': PaperWidget;
  }
}

export class PaperWidget extends Nexinterface {
  static {
    this.registerAs('paper-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          background: var(--surfaceColor);
          color: var(--onSurfaceColor);
          border-radius: 8px;
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

  override get template(): WidgetTemplate {
    return html`<slot></slot>`;
  }
}
