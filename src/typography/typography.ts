import { css, html, WidgetAnimation, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';

export type TypographyVariant =
  | 'text'
  | 'iranic'
  | 'button-uppercased'
  | 'button-normal'
  | 'headline'
  | 'app-bar';

declare global {
  interface HTMLElementTagNameMap {
    'typography-widget': TypographyWidget;
  }
}

export interface TypographyWidget {
  get variant(): TypographyVariant | null;
  set variant(v: TypographyVariant | null);

  get oneLine(): boolean;
  set oneLine(v: boolean);
}

export class TypographyWidget extends Nexinterface {
  static {
    this.createAttributes([
      { key: 'variant', type: 'string' },
      { key: 'oneLine', type: 'boolean' },
    ]);

    this.registerAs('typography-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          word-wrap: break-word;
          font-size: inherit;
          font-family: 'Dana VF', 'Jost VF';
          line-height: normal;
          letter-spacing: 0.25px;
          padding: 0px;
          margin: 0px;
          font-variation-settings: 'wght' var(--typographyWeight);
        }

        :host([variant='text']) {
          padding: 0px 16px;
          font-size: 16px;
          --typographyWeight: 350;
        }

        :host([variant='iranic']) {
          display: inline;
          font-variation-settings: 'wght' var(--typographyWeight), 'slnt' 8;
        }

        :host([variant='iranic']:dir(ltr)) {
          font-variation-settings: 'wght' var(--typographyWeight) 'ital' 1;
        }

        :host([variant='button-uppercased']),
        :host([variant='button-normal']) {
          padding: 0px;
          font-size: 16px;
          letter-spacing: 0.75px;
          text-transform: capitalize;
          --typographyWeight: 425;
        }

        :host([variant='button-uppercased']) {
          text-transform: uppercase;
          letter-spacing: 1.25px;
          font-size: 14px;
          --typographyWeight: 500;
        }

        :host([variant='headline']) {
          text-transform: capitalize;
          padding: 0px 16px;
          font-size: 18px;
          --typographyWeight: 575;
        }

        :host([variant='app-bar']) {
          text-transform: capitalize;
          padding: 0px 16px;
          font-size: 20px;
          --typographyWeight: 650;
        }

        :host([one-line]) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (prefers-color-scheme: dark) {
          :host([variant='text']) {
            --typographyWeight: 300;
          }

          :host([variant='button-uppercased']),
          :host([variant='button-normal']) {
            --typographyWeight: 364;
          }

          :host([variant='button-uppercased']) {
            --typographyWeight: 429;
          }

          :host([variant='headline']) {
            --typographyWeight: 493;
          }

          :host([variant='app-bar']) {
            --typographyWeight: 557;
          }
        }
      `,
    ];
  }

  override get template(): WidgetTemplate {
    return html`<slot></slot>`;
  }

  override get mountAnimation(): WidgetAnimation {
    return this.variant === 'app-bar'
      ? {
          keyframes: [
            { opacity: '0', transform: 'scale(0.9)' },
            { opacity: '1', transform: 'scale(1)' },
          ],
          options: {
            duration: Number(this.getCSSProperty('--durationLvl2').replace('ms', '')),
            easing: this.getCSSProperty('--deceleratedEase'),
            fill: 'forwards',
          },
        }
      : this.updateOrSlotChangeAnimation;
  }

  override get updateOrSlotChangeAnimation(): WidgetAnimation {
    return this.variant === 'app-bar'
      ? {
          keyframes: [
            { transform: 'translateY(-16px) rotateX(-90deg)' },
            { transform: 'translateY(0px) rotateX(0deg)' },
          ],
          options: {
            duration: Number(this.getCSSProperty('--durationLvl2').replace('ms', '')),
            easing: this.getCSSProperty('--deceleratedEase'),
            fill: 'forwards',
          },
        }
      : {
          keyframes: [{ opacity: '0' }, { opacity: '1' }],
          options: {
            duration: Number(this.getCSSProperty('--durationLvl1').replace('ms', '')),
            easing: this.getCSSProperty('--deceleratedEase'),
            fill: 'forwards',
          },
        };
  }
}
