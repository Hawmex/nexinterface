import { css, html, WidgetTemplate } from 'nexwidget';
import '../icon/icon.js';
import { Interactive } from '../interactive/interactive.js';
import '../typography/typography.js';

declare global {
  interface HTMLElementTagNameMap {
    'switch-widget': SwitchWidget;
  }
}

export interface SwitchWidget {
  get text(): string | null;
  set text(v: string | null);

  get icon(): string | null;
  set icon(v: string | null);
}

export class SwitchWidget extends Interactive {
  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: grid;
          grid-template-columns: 24px 1fr 36px;
          padding: 12px 16px;
          gap: 32px;
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

  override get template(): WidgetTemplate {
    return html`
      <icon-widget value=${this.icon!}></icon-widget>
      <typography-widget variant="button-normal" class="text">${this.text}</typography-widget>
      <div class="track"><div class="thumb"></div></div>
    `;
  }
}

SwitchWidget.createAttributes([
  { key: 'text', type: 'string' },
  { key: 'icon', type: 'string' },
]);

SwitchWidget.createReactives(['text', 'icon']);
SwitchWidget.registerAs('switch-widget');
