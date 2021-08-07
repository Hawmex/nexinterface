import { css, Nexwidget, NexwidgetAnimation } from 'nexwidget';

declare global {
  interface HTMLElementTagNameMap {
    'icon-widget': IconWidget;
  }
}

export interface IconWidget {
  get value(): string | null;
  set value(v: string | null);
}

export class IconWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
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

  get mountAnimation(): NexwidgetAnimation {
    return [
      [
        { transform: 'rotateX(-90deg)', opacity: '0' },
        { transform: 'rotateX(0deg)', opacity: '1' },
      ],
      {
        duration: Number(this.getCSSProperty('--durationLvl2').replace('ms', '')),
        easing: this.getCSSProperty('--standardEase'),
        fill: 'forwards',
      },
    ];
  }

  get updateOrSlotChangeAnimation(): NexwidgetAnimation {
    return [
      [
        { transform: 'rotateZ(-90deg)', opacity: '0' },
        { transform: 'rotateZ(0deg)', opacity: '1' },
      ],
      {
        duration: Number(this.getCSSProperty('--durationLvl2').replace('ms', '')),
        easing: this.getCSSProperty('--standardEase'),
        fill: 'forwards',
      },
    ];
  }
}

IconWidget.createAttributes([['value', String]]);
IconWidget.createReactives(['value']);
IconWidget.register('icon-widget');
