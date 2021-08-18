import { css, WidgetAnimation } from 'nexwidget';
import { Nexinterface } from '../base/base.js';

export class Screen extends Nexinterface {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: grid;
          grid-auto-flow: row;
          gap: 16px;
          padding: 16px 0px;
        }
      `,
    ];
  }

  get mountAnimation(): WidgetAnimation {
    return {
      keyframes: [
        { opacity: '0', transform: 'scale(0.9)' },
        { opacity: '1', transform: 'scale(1)' },
      ],
      options: {
        duration: Number(this.getCSSProperty('--durationLvl2').replace('ms', '')),
        easing: this.getCSSProperty('--deceleratedEase'),
        fill: 'forwards',
      },
    };
  }
}
