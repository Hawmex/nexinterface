import { css, Nexwidget } from 'nexwidget';

export class AppScaffold extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: grid;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
          background: var(--backgroundColor);
          color: var(--onBackgroundColor);

          --primaryColor: #5701a8;
          --onPrimaryColor: #ffffff;
          --backgroundColor: #fafafa;
          --onBackgroundColor: #000000;
          --surfaceColor: #ffffff;
          --onSurfaceColor: #000000;
          --errorColor: #d43936;

          --shadowLvl1: rgba(0, 0, 0, 0.04) 0px 1px 3px 0px;
          --shadowLvl2: rgba(0, 0, 0, 0.08) 0px 2px 6px 0px;
          --shadowLvl3: rgba(0, 0, 0, 0.12) 0px 3px 9px 0px;
          --shadowLvl4: rgba(0, 0, 0, 0.16) 0px 4px 12px 0px;

          --durationLvl1: 200ms;
          --durationLvl2: 275ms;
          --durationLvl3: 350ms;
          --durationLvl4: 1600ms;

          --standardEase: cubic-bezier(0.4, 0, 0.2, 1);
          --acceleratedEase: cubic-bezier(0.4, 0, 1, 1);
          --deceleratedEase: cubic-bezier(0, 0, 0.2, 1);
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --onPrimaryColor: #111111;
            --backgroundColor: #111111;
            --onBackgroundColor: #ffffff;
            --surfaceColor: #212121;
            --onSurfaceColor: #ffffff;
          }
        }
      `,
    ];
  }
}
