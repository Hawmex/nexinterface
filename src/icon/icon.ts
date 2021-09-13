import { css, WidgetAnimation } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';

declare global {
  interface HTMLElementTagNameMap {
    'icon-widget': IconWidget;
  }
}

export interface IconWidget {
  get value(): string | null;
  set value(v: string | null);
}

export class IconWidget extends Nexinterface {
  static {
    this.createAttributes([{ key: 'value', type: 'string' }]);
    this.createReactives(['value']);
    this.registerAs('icon-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          font-family: 'Material Icons';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
        }

        :host::before {
          content: attr(value);
        }
      `,
    ];
  }

  override get mountAnimation(): WidgetAnimation {
    return {
      keyframes: [{ transform: 'rotateX(-90deg)' }, { transform: 'rotateX(0deg)' }],
      options: {
        duration: Number(this.getCSSProperty('--durationLvl2').replace('ms', '')),
        easing: this.getCSSProperty('--standardEase'),
        fill: 'forwards',
      },
    };
  }

  override get updateOrSlotChangeAnimation(): WidgetAnimation {
    return {
      keyframes: [
        { transform: 'rotateZ(-90deg) rotateY(-90deg)' },
        { transform: 'rotateZ(0deg) rotateY(0deg)' },
      ],
      options: {
        duration: Number(this.getCSSProperty('--durationLvl2').replace('ms', '')),
        easing: this.getCSSProperty('--standardEase'),
        fill: 'forwards',
      },
    };
  }
}
