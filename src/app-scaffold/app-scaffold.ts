import { css } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';

export class AppScaffold extends Nexinterface {
  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: grid;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          position: relative;
          background: var(--backgroundColor);
          color: var(--onBackgroundColor);
          accent-color: var(--primaryColor);

          --primaryColor: #1eb06d;
          --onPrimaryColor: #ffffff;
          --backgroundColor: #f0f0f0;
          --onBackgroundColor: #000000;
          --surfaceColor: #ffffff;
          --onSurfaceColor: #000000;
          --errorColor: #ef5350;

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
            color-scheme: dark;

            --onPrimaryColor: #1c2128;
            --backgroundColor: #1c2128;
            --onBackgroundColor: #ffffff;
            --surfaceColor: #22272e;
            --onSurfaceColor: #ffffff;
          }
        }
      `,
    ];
  }
}
