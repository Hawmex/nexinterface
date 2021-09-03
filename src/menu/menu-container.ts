import { css, html, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';

declare global {
  interface HTMLElementTagNameMap {
    'menu-container-widget': MenuContainerWidget;
  }
}

export class MenuContainerWidget extends Nexinterface {
  static {
    this.registerAs('menu-container-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 8px;
          gap: 8px;
          background: var(--surfaceColor);
        }
      `,
    ];
  }

  override get template(): WidgetTemplate {
    return html`<slot></slot>`;
  }
}
