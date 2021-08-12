import { css, html, Nexwidget, WidgetAnimation, WidgetTemplate } from 'nexwidget';

export type TypographyVariant =
  | 'text'
  | 'iranic'
  | 'button-uppercased'
  | 'button-normal'
  | 'headline'
  | 'top-bar';

declare global {
  interface HTMLElementTagNameMap {
    'typography-widget': TypographyWidget;
  }
}

export interface TypographyWidget {
  get variant(): TypographyVariant | null;
  set variant(v: TypographyVariant | null);
}

export class TypographyWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
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
          box-sizing: border-box;
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

        :host([variant='top-bar']) {
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
      `,
    ];
  }

  get template(): WidgetTemplate {
    return html`<slot></slot>`;
  }

  get mountAnimation(): WidgetAnimation {
    return this.variant === 'top-bar'
      ? [
          [
            { opacity: '0', transform: 'scale(0.9)' },
            { opacity: '1', transform: 'scale(1)' },
          ],
          {
            duration: Number(this.getCSSProperty('--durationLvl2').replace('ms', '')),
            easing: this.getCSSProperty('--deceleratedEase'),
            fill: 'forwards',
          },
        ]
      : this.updateOrSlotChangeAnimation;
  }

  get updateOrSlotChangeAnimation(): WidgetAnimation {
    return this.variant === 'top-bar'
      ? [
          [
            { opacity: '0', transform: 'translateY(-16px) rotateX(-90deg)' },
            { opacity: '1', transform: 'translateY(0px) rotateX(0deg)' },
          ],
          {
            duration: Number(this.getCSSProperty('--durationLvl2').replace('ms', '')),
            easing: this.getCSSProperty('--deceleratedEase'),
            fill: 'forwards',
          },
        ]
      : [
          [{ opacity: '0' }, { opacity: '1' }],
          {
            duration: Number(this.getCSSProperty('--durationLvl1').replace('ms', '')),
            easing: this.getCSSProperty('--deceleratedEase'),
            fill: 'forwards',
          },
        ];
  }
}

TypographyWidget.createAttributes([['variant', String]]);
TypographyWidget.register('typography-widget');
