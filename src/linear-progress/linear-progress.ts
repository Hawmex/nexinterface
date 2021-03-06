import { css, html, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';

declare global {
  interface HTMLElementTagNameMap {
    'linear-progress-widget': LinearProgressWidget;
  }
}

export interface LinearProgressWidget {
  get active(): boolean;
  set active(v: boolean);
}

export class LinearProgressWidget extends Nexinterface {
  static {
    this.createAttributes([{ key: 'active', type: 'boolean' }]);
    this.registerAs('linear-progress-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          height: 4px;
          overflow: hidden;
          border-radius: 2px;
          visibility: hidden;
          transform: scaleY(0);
          transition: transform calc(var(--durationLvl1) - 50ms)
              var(--deceleratedEase),
            visibility calc(var(--durationLvl1) - 50ms) var(--deceleratedEase);
          will-change: transform;
        }

        :host([active]) {
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
          animation: indeterminate-rtl var(--durationLvl4) var(--standardEase)
            infinite;
          animation-play-state: paused;
        }

        :host([active]) .bar {
          animation-play-state: running;
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

  override get template(): WidgetTemplate {
    return html`
      <div class="container">
        <div class="bar">
          <span class="colored"></span>
          <span></span>
          <span class="colored"></span>
        </div>
      </div>
    `;
  }
}
