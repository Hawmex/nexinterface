import { css, html, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';

declare global {
  interface HTMLElementTagNameMap {
    'chips-container-widget': ChipsContainerWidget;
  }
}

export class ChipsContainerWidget extends Nexinterface {
  static {
    this.registerAs('chips-container-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          width: 100%;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 8px;
          padding: 8px;
        }
      `,
    ];
  }

  override get template(): WidgetTemplate {
    return html`<slot></slot>`;
  }
}
