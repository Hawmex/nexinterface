import { css, html, nothing, WidgetTemplate } from 'nexwidget/nexwidget.js';
import '../icon/icon.js';
import { Interactive } from '../interactive/interactive.js';
import '../typography/typography.js';

declare global {
  interface HTMLElementTagNameMap {
    'chip-widget': ChipWidget;
  }
}

export interface ChipWidget {
  get icon(): string | null;
  set icon(v: string | null);

  get text(): string | null;
  set text(v: string | null);
}

export class ChipWidget extends Interactive {
  static {
    this.createAttributes([
      { key: 'icon', type: 'string' },
      { key: 'text', type: 'string' },
    ]);
    
    this.createReactives(['icon', 'text']);
    this.registerAs('chip-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          width: max-content;
          background: var(--backgroundColor);
          min-height: 32px;
          gap: 8px;
          padding: 4px;
          align-items: center;
          border-radius: 10000px;
          box-shadow: var(--shadowLvl1);
        }

        :host typography-widget {
          padding: 0px 8px;
        }

        :host([icon]) typography-widget {
          padding-inline-start: 0px;
        }
      `,
    ];
  }

  override get template(): WidgetTemplate {
    return html`
      ${this.icon ? html`<icon-widget value=${this.icon}></icon-widget>` : nothing}
      <typography-widget variant="text"> ${this.text} </typography-widget>
    `;
  }
}
