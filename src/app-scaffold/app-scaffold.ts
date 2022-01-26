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

          --durationLvl1: 200ms;
          --durationLvl2: 275ms;
          --durationLvl3: 350ms;
          --durationLvl4: 1600ms;

          --standardEase: cubic-bezier(0.4, 0, 0.2, 1);
          --acceleratedEase: cubic-bezier(0.4, 0, 1, 1);
          --deceleratedEase: cubic-bezier(0, 0, 0.2, 1);

          --shadowLvl1: 0px 0px 0.1px -1px rgba(0, 0, 0, 0.135),
            0px 0.1px 0.2px -1px rgba(0, 0, 0, 0.194),
            0px 0.1px 0.4px -1px rgba(0, 0, 0, 0.24),
            0px 0.2px 0.7px -1px rgba(0, 0, 0, 0.286),
            0px 0.4px 1.3px -1px rgba(0, 0, 0, 0.345),
            0px 1px 3px -1px rgba(0, 0, 0, 0.48);
          --shadowLvl2: 0px 0.1px 0.2px -2px rgba(0, 0, 0, 0.101),
            0px 0.1px 0.4px -2px rgba(0, 0, 0, 0.145),
            0px 0.3px 0.8px -2px rgba(0, 0, 0, 0.18),
            0px 0.4px 1.3px -2px rgba(0, 0, 0, 0.215),
            0px 0.8px 2.5px -2px rgba(0, 0, 0, 0.259),
            0px 2px 6px -2px rgba(0, 0, 0, 0.36);
          --shadowLvl3: 0px 0.1px 0.2px -3px rgba(0, 0, 0, 0.067),
            0px 0.2px 0.6px -3px rgba(0, 0, 0, 0.097),
            0px 0.4px 1.1px -3px rgba(0, 0, 0, 0.12),
            0px 0.7px 2px -3px rgba(0, 0, 0, 0.143),
            0px 1.3px 3.8px -3px rgba(0, 0, 0, 0.173),
            0px 3px 9px -3px rgba(0, 0, 0, 0.24);
          --shadowLvl4: 0px 0.1px 0.3px -4px rgba(0, 0, 0, 0.034),
            0px 0.3px 0.8px -4px rgba(0, 0, 0, 0.048),
            0px 0.5px 1.5px -4px rgba(0, 0, 0, 0.06),
            0px 0.9px 2.7px -4px rgba(0, 0, 0, 0.072),
            0px 1.7px 5px -4px rgba(0, 0, 0, 0.086),
            0px 4px 12px -4px rgba(0, 0, 0, 0.12);
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
