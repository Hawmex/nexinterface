import { css, Nexwidget, WidgetAnimation } from 'nexwidget';

export class Screen extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: grid;
          grid-auto-flow: row;
          gap: 16px;
          padding: 16px 0px;
          box-sizing: border-box;
        }
      `,
    ];
  }

  get mountAnimation(): WidgetAnimation {
    return [
      [
        { opacity: '0', transform: 'scale(0.9)' },
        { opacity: '1', transform: 'scale(1)' },
      ],
      {
        duration: Number(this.getCSSProperty('--durationLvl2').replace('ms', '')),
        easing: this.getCSSProperty('--deceleratedEase'),
        fill: 'forwards',
      },
    ];
  }
}
