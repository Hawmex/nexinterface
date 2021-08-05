import { Nexwidget, css, html, nothing, NexwidgetTemplate } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'linear-progress-widget': LinearProgressWidget;
  }
}

export interface LinearProgressWidget {
  get active(): boolean;
  set active(v: boolean);
}

export class LinearProgressWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          height: 4px;
          box-sizing: border-box;
          overflow: hidden;
          border-radius: 2px;
          opacity: 0;
          visibility: hidden;
          transform: scaleY(0);
          transition: opacity calc(var(--durationLvl1) - 50ms) var(--deceleratedEase),
            transform calc(var(--durationLvl1) - 50ms) var(--deceleratedEase),
            visibility calc(var(--durationLvl1) - 50ms) var(--deceleratedEase);
          will-change: opacity, transform;
        }

        :host([active]) {
          opacity: 1;
          visibility: visible;
          transform: scaleY(1);
          transition-duration: var(--durationLvl1);
          transition-delay: var(--durationLvl1);
        }

        @keyframes indeterminate-rtl {
          0% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(50%);
          }
        }

        :host .container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        :host .container::before {
          content: '';
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0px;
          right: 0px;
          background: var(--primaryColor);
          opacity: 0.32;
        }

        :host .bar {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          width: 200%;
          height: 100%;
          animation: indeterminate-rtl var(--durationLvl4) var(--standardEase) infinite;
        }

        :host .bar:dir(ltr) {
          animation-name: indeterminate;
        }

        :host span {
          width: 100%;
          height: 100%;
        }

        :host .colored {
          background: var(--primaryColor);
        }
      `,
    ];
  }

  get template(): NexwidgetTemplate {
    return html`
      <div class="container">
        ${this.active
          ? html`
              <div class="bar">
                <span class="colored"></span>
                <span></span>
                <span class="colored"></span>
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

LinearProgressWidget.createAttributes([['active', Boolean]]);
LinearProgressWidget.createReactives(['active']);
LinearProgressWidget.register('linear-progress-widget');
