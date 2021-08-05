import { Nexbounce } from 'nexbounce';
import { Nexstate } from 'nexstate';
import { css, html, Nexwidget, NexwidgetTemplate, nothing } from 'nexwidget';
import '../button/button.js';
import '../typography/typography.js';

export type SnackbarInstance = {
  text: string;
  button?: {
    text: string;
    action: () => void;
  };
};

export type SnackbarFinalInstance = {
  id: symbol;
} & SnackbarInstance;

const snackbarsQueue = new Nexstate<SnackbarFinalInstance[]>([]);

const removeSnackbar = () => snackbarsQueue.setState((state) => state.slice(1));

export const addSnackbar = (snackbar: SnackbarInstance) =>
  snackbarsQueue.setState((state) => [...state, { ...snackbar, id: Symbol(snackbar.text) }]);

declare global {
  interface HTMLElementTagNameMap {
    'snackbar-widget': SnackbarWidget;
  }
}

export interface SnackbarWidget {
  get value(): SnackbarFinalInstance;
  set value(v: SnackbarFinalInstance);

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

  #timer?: number;

  #resizeDebouncer = new Nexbounce();
  #activeTime = 6000;

  addedCallback() {
    super.addedCallback();

    snackbarsQueue.runAndSubscribe(
      ([snackbar]) => {
        const fadeTime = Number(this.getCSSProperty('--durationLvl2').replace('ms', '')) - 50;

        if (this.value?.id !== snackbar?.id) {
          this.active = false;

          setTimeout(() => {
            this.value = snackbar;
            this.active = !!snackbar;

            if (snackbar) this.#activateRemoveTimer();
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

  get template(): NexwidgetTemplate {
    return html`
      <typography-widget variant="text" class="text">${this.value?.text}</typography-widget>
      ${this.value?.button?.text
        ? html`
            <button-widget
              @click=${this.#buttonAction.bind(this)}
              variant="text"
              text=${this.value.button.text}
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
    return (
      (this.shadowRoot!.querySelector('.button')?.getBoundingClientRect?.()?.width ?? 0) >
      (innerWidth - 16) / 2
    );
  }

  #handleResize() {
    this.#resizeDebouncer.enqueue(() => (this.longButtonText = this.#getLongButtonTextValue()));
  }

  #buttonAction() {
    this.value.button?.action?.();
    this.#deactivateRemoveTimer();

    removeSnackbar();
  }
}

SnackbarWidget.createAttributes([
  ['active', Boolean],
  ['longButtonText', Boolean],
]);

SnackbarWidget.createReactives(['value', 'longButtonText']);
SnackbarWidget.register('snackbar-widget');
