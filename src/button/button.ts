import { css, html, NexwidgetTemplate, nothing } from 'nexwidget';
import { Interactive } from '../interactive/interactive.js';

import '../typography/typography.js';
import '../icon/icon.js';

type ButtonVariant = 'solid' | 'text' | 'list' | 'menu';

declare global {
  interface HTMLElementTagNameMap {
    'button-widget': ButtonWidget;
  }
}

interface ButtonWidget {
  get link(): string;
  set link(v: string);

  get text(): string;
  set text(v: string);

  get icon(): string;
  set icon(v: string);

  get variant(): ButtonVariant;
  set variant(v: ButtonVariant);
}

class ButtonWidget extends Interactive {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: grid;
          grid-template-columns: 1fr;
          box-sizing: border-box;
          align-items: center;
          padding: 8px;
          cursor: pointer;
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

        :host([text][icon]) {
          grid-template-columns: 24px 1fr;
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
          text-align: center;
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

  addedCallback() {
    super.addedCallback();
    this.addEventListener('click', this.#navigate, { signal: this.removedSignal });
  }

  updatedCallback() {
    super.updatedCallback();
    this.centeredRipple = !this.text;
  }

  get template(): NexwidgetTemplate {
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
  ['variant', String],
  ['text', String],
  ['icon', String],
  ['link', String],
]);

ButtonWidget.createReactives(['text', 'icon']);
ButtonWidget.register('button-widget');
