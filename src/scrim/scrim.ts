import { css, Nexwidget } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'scrim-widget': ScrimWidget;
  }
}

export class ScrimWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          visibility: hidden;
          position: absolute;
          top: 0px;
          right: 0px;
          z-index: 2;
          width: 100vw;
          height: 100vh;
          opacity: 0;
          background: #000000;
          transition: opacity calc(var(--durationLvl2) - 50ms) var(--deceleratedEase),
            visibility calc(var(--durationLvl2) - 50ms) var(--deceleratedEase);
          will-change: opacity;
        }

        :host([active]) {
          opacity: 0.32;
          visibility: visible;
          transition-duration: var(--durationLvl2);
        }
      `,
    ];
  }
}

ScrimWidget.register('scrim-widget');
