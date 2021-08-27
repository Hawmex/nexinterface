import { css, html, WidgetTemplate, nothing } from 'nexwidget';
import '../icon/icon.js';
import { Interactive } from '../interactive/interactive.js';
import '../typography/typography.js';

export type ButtonVariant = 'solid' | 'text' | 'list' | 'menu';

declare global {
  interface HTMLElementTagNameMap {
    'button-widget': ButtonWidget;
  }
}

export interface ButtonWidget {
  get link(): string | null;
  set link(v: string | null);

  get text(): string | null;
  set text(v: string | null);

  get icon(): string | null;
  set icon(v: string | null);

  get variant(): ButtonVariant | null;
  set variant(v: ButtonVariant | null);
}

export class ButtonWidget extends Interactive {
  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          align-items: center;
          padding: 8px;
          background: inherit;
        }

        :host([icon]) {
          width: 40px;
          border-radius: 50%;
        }

        :host([text]) {
          border-radius: 4px;
          height: max-content;
          padding: 6px 8px;
          width: max-content;
          align-items: center;
        }

        :host([variant='menu'][text][icon]),
        :host([variant='list'][text][icon]) {
          color: var(--onSurfaceColor);
          width: 100%;
          gap: 32px;
          min-height: 40px;
        }

        :host([variant='list'][text][icon]) {
          min-height: 48px;
          border-radius: 0px;
          padding: 6px 16px;
        }

        :host([variant='text']) {
          color: var(--primaryColor);
        }

        :host([variant='solid']) {
          background: var(--primaryColor);
          color: var(--onPrimaryColor);
          box-shadow: var(--shadowLvl3);
        }

        :host([no-shadow]) {
          box-shadow: none;
        }

        :host([variant='text'][text]),
        :host([variant='solid'][text]) {
          min-width: 64px;
          min-height: 36px;
          justify-content: center;
        }

        :host([variant='solid'][text]) {
          padding: 6px 16px;
        }

        :host([variant='text'][text][icon]) {
          gap: 8px;
        }

        :host([variant='solid'][text][icon]) {
          gap: 16px;
        }
      `,
    ];
  }

  get #typographyVariant() {
    return this.variant === 'solid' || this.variant === 'text'
      ? 'button-uppercased'
      : 'button-normal';
  }

  override addedCallback() {
    super.addedCallback();
    this.addEventListener('click', this.#navigate, { signal: this.removedSignal });
  }

  override updatedCallback() {
    super.updatedCallback();
    this.centeredRipple = !this.text;
  }

  override get template(): WidgetTemplate {
    return html`
      ${this.icon ? html`<icon-widget value=${this.icon} class="icon"></icon-widget>` : nothing}
      ${this.text
        ? html`
            <typography-widget variant=${this.#typographyVariant}>${this.text}</typography-widget>
          `
        : nothing}
    `;
  }

  #navigate() {
    if (this.link) history.pushState({}, document.title, this.link);
  }
}

ButtonWidget.createAttributes([
  { key: 'variant', type: 'string' },
  { key: 'text', type: 'string' },
  { key: 'icon', type: 'string' },
  { key: 'link', type: 'string' },
]);

ButtonWidget.createReactives(['text', 'icon']);
ButtonWidget.registerAs('button-widget');
