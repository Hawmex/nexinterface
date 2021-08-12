import { Nexbounce } from 'nexbounce';
import { Nexstate } from 'nexstate';
import { css, html, Nexwidget, WidgetTemplate, nothing } from 'nexwidget';
import '../button/button.js';
import { ButtonWidget } from '../button/button.js';
import '../typography/typography.js';

export type SnackbarButton = {
  text: string;
  action: () => void;
};

export type SnackbarInstance = {
  text: string;
  button?: SnackbarButton;
};

export type SnackbarFinalInstance = {
  id: symbol;
} & SnackbarInstance;

export const snackbarsQueue = new Nexstate<SnackbarFinalInstance[]>([]);

const removeSnackbar = () => snackbarsQueue.setState((state) => state.slice(1));

export const addSnackbar = (snackbar: SnackbarInstance) =>
  snackbarsQueue.setState((state) => [...state, { ...snackbar, id: Symbol(snackbar.text) }]);

declare global {
  interface HTMLElementTagNameMap {
    'snackbar-widget': SnackbarWidget;
  }
}

export interface SnackbarWidget {
  get text(): string | undefined;
  set text(v: string | undefined);

  get button(): SnackbarButton | undefined;
  set button(v: SnackbarButton | undefined);

  get active(): boolean;
  set active(v: boolean);

  get longButtonText(): boolean;
  set longButtonText(v: boolean);
}

export class SnackbarWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          position: absolute;
          z-index: 0;
          bottom: 8px;
          right: 8px;
          border-radius: 8px;
          box-sizing: border-box;
          background: var(--onSurfaceColor);
          color: var(--surfaceColor);
          display: grid;
          gap: 8px;
          grid-auto-flow: column;
          align-items: center;
          justify-content: space-between;
          min-height: 48px;
          max-width: calc(100% - 16px);
          padding: 6px 8px;
          box-shadow: var(--shadowLvl3);
          transform: scale(0.9);
          opacity: 0;
          visibility: hidden;
          transition: opacity calc(var(--durationLvl2) - 50ms) var(--deceleratedEase),
            transform 0ms var(--deceleratedEase) calc(var(--durationLvl2) - 50ms),
            visibility calc(var(--durationLvl2) - 50ms) var(--deceleratedEase);
          will-change: opacity, transform;
        }

        :host(:dir(ltr)) {
          right: initial;
          left: 8px;
        }

        :host .text {
          padding: 0px 8px;
        }

        :host([active]) {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
          transition: opacity var(--durationLvl2) var(--deceleratedEase),
            transform var(--durationLvl2) var(--deceleratedEase),
            visibility var(--durationLvl2) var(--deceleratedEase);
        }

        :host([long-button-text]) {
          display: flex;
          flex-direction: column;
          justify-content: initial;
          align-items: initial;
          padding: 8px;
        }

        :host([long-button-text]) .button {
          align-self: flex-end;
        }

        @media (max-width: 640px) {
          :host {
            width: calc(100vw - 16px);
          }
        }
      `,
    ];
  }

  #id?: symbol;
  #timer?: number;

  #resizeDebouncer = new Nexbounce();
  #activeTime = 6000;

  addedCallback() {
    super.addedCallback();

    snackbarsQueue.runAndSubscribe(
      ([snackbar]: Array<SnackbarFinalInstance | undefined>) => {
        if (this.#id !== snackbar?.id) {
          const fadeTime = Number(this.getCSSProperty('--durationLvl2').replace('ms', '')) - 50;

          this.active = false;

          setTimeout(() => {
            this.#id = snackbar?.id;

            this.text = snackbar?.text;
            this.button = snackbar?.button;

            this.active = !!snackbar;

            if (this.active) this.#activateRemoveTimer();
          }, fadeTime);
        }
      },
      { signal: this.removedSignal },
    );

    addEventListener('resize', this.#handleResize.bind(this), { signal: this.removedSignal });
  }

  updatedCallback() {
    super.updatedCallback();
    this.longButtonText = this.#getLongButtonTextValue();
  }

  get template(): WidgetTemplate {
    return html`
      <typography-widget variant="text" class="text">${this.text}</typography-widget>
      ${this.button
        ? html`
            <button-widget
              @click=${this.#buttonAction.bind(this)}
              variant="text"
              text=${this.button.text}
              class="button"
            ></button-widget>
          `
        : nothing}
    `;
  }

  #activateRemoveTimer() {
    this.#timer = setTimeout(removeSnackbar, this.#activeTime);
  }

  #deactivateRemoveTimer() {
    clearTimeout(this.#timer);
  }

  #getLongButtonTextValue() {
    const body = <ButtonWidget | null>this.shadowRoot!.querySelector('.button');
    return (body?.getBoundingClientRect?.()?.width ?? 0) > (innerWidth - 16) / 2;
  }

  #handleResize() {
    this.#resizeDebouncer.enqueue(() => (this.longButtonText = this.#getLongButtonTextValue()));
  }

  #buttonAction() {
    this.button!.action();
    this.#deactivateRemoveTimer();

    removeSnackbar();
  }
}

SnackbarWidget.createAttributes([
  ['active', Boolean],
  ['longButtonText', Boolean],
]);

SnackbarWidget.createReactives(['text', 'button', 'longButtonText']);
SnackbarWidget.register('snackbar-widget');
