import { css, Nexwidget } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'divider-widget': DividerWidget;
  }
}

export class DividerWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
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

DividerWidget.register('divider-widget');
