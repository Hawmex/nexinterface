import { css } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';

declare global {
  interface HTMLElementTagNameMap {
    'divider-widget': DividerWidget;
  }
}

export class DividerWidget extends Nexinterface {
  static {
    this.registerAs('divider-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          width: 100%;
          display: block;
          width: 100%;
          height: 1px;
          background: var(--onSurfaceColor);
          opacity: 0.08;
        }
      `,
    ];
  }
}
