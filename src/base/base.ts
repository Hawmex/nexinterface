import { css, Nexwidget } from 'nexwidget';

export class Nexinterface extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host,
        :host::before,
        :host::after,
        :host *,
        :host *::before,
        :host *::after {
          user-select: none;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
          box-sizing: border-box;
        }
      `,
    ];
  }
}
