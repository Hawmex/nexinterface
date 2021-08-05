import { css, html, NexwidgetTemplate } from 'nexwidget';
import { Interactive } from '../interactive/interactive.js';

import '../typography/typography.js';
import '../icon/icon.js';

declare global {
  interface HTMLElementTagNameMap {
    'switch-widget': SwitchWidget;
  }
}

export interface SwitchWidget {
  get text(): string;
  set text(v: string);

  get icon(): string;
  set icon(v: string);
}

export class SwitchWidget extends Interactive {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          cursor: pointer;
          display: grid;
          grid-template-columns: 24px 1fr 36px;
          padding: 12px 16px;
          gap: 32px;
          box-sizing: border-box;
        }

        :host .text {
          align-self: center;
        }

        :host .track {
          pointer-events: none;
          position: relative;
          display: flex;
          width: 36px;
          height: 20px;
          align-self: center;
          align-items: center;
          justify-content: center;
        }

        :host .track::before {
          content: '';
          position: absolute;
          top: 3px;
          right: 2px;
          width: 32px;
          height: 14px;
          border-radius: 7px;
          background: var(--onSurfaceColor);
          opacity: 0.08;
          transition: background-color var(--durationLvl1) var(--deceleratedEase),
            opacity var(--durationLvl1) var(--deceleratedEase);
          will-change: background-color, opacity;
        }

        :host .thumb {
          position: relative;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          transition: transform var(--durationLvl1) var(--deceleratedEase);
          will-change: transform;
          transform: translateX(8px);
        }

        :host .thumb:dir(ltr) {
          transform: translateX(-8px);
        }

        :host .thumb::before {
          content: '';
          position: absolute;
          top: 0px;
          right: 0px;
          width: 20px;
          height: 20px;
          background: var(--onSurfaceColor);
          opacity: 0.08;
          border-radius: 50%;
        }

        :host .thumb::after {
          content: '';
          position: absolute;
          top: 2px;
          right: 2px;
          width: 16px;
          height: 16px;
          background: var(--surfaceColor);
          border-radius: 50%;
        }

        :host([active]) .track::before {
          background: var(--primaryColor);
          opacity: 1;
        }

        :host([active]) .thumb {
          transform: translateX(-8px);
        }

        :host([active]) .thumb:dir(ltr) {
          transform: translateX(8px);
        }

        :host([active]) .thumb::before {
          background: var(--primaryColor);
          opacity: 1;
        }
      `,
    ];
  }

  get template(): NexwidgetTemplate {
    return html`
      <icon-widget value=${this.icon}></icon-widget>
      <typography-widget variant="button-normal" class="text">${this.text}</typography-widget>
      <div class="track"><div class="thumb"></div></div>
    `;
  }
}

SwitchWidget.createAttributes([
  ['text', String],
  ['icon', String],
]);

SwitchWidget.createReactives(['text', 'icon']);
SwitchWidget.register('switch-widget');
