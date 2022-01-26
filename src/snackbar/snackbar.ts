import { Debouncer } from 'nexbounce/nexbounce.js';
import { Store } from 'nexstate/nexstate.js';
import { css, html, nothing, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { AppBarWidget } from '../app-bar/app-bar.js';
import { Nexinterface } from '../base/base.js';
import '../button/button.js';
import { ButtonWidget } from '../button/button.js';
import '../typography/typography.js';

export type SnackbarPlaceOverAppBar = 'none' | 'normal' | 'tabs' | 'loading';

export type SnackbarButton = { text: string; action: () => void };
export type SnackbarInstance = { text: string; button?: SnackbarButton };
export type SnackbarFinalInstance = { id: symbol } & SnackbarInstance;

export class SnackbarStore extends Store {
  queue: SnackbarFinalInstance[] = [];

  pushQueue(snackbar: SnackbarInstance) {
    this.setState(() =>
      this.queue.push({ ...snackbar, id: Symbol(snackbar.text) }),
    );
  }

  shiftQueue() {
    this.setState(() => this.queue.shift());
  }
}

export const snackbarStore = new SnackbarStore();

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

  get placeOverAppBar(): SnackbarPlaceOverAppBar | undefined;
  set placeOverAppBar(v: SnackbarPlaceOverAppBar | undefined);
}

export class SnackbarWidget extends Nexinterface {
  static {
    this.createAttributes([
      { key: 'active', type: 'boolean' },
      { key: 'longButtonText', type: 'boolean' },
      { key: 'placeOverAppBar', type: 'string' },
    ]);

    this.createReactives(['text', 'button']);
    this.registerAs('snackbar-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          position: absolute;
          z-index: 0;
          right: 8px;
          border-radius: 8px;
          background: var(--onSurfaceColor);
          color: var(--surfaceColor);
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: space-between;
          min-height: 48px;
          max-width: calc(100% - 16px);
          padding: 6px 8px;
          box-shadow: var(--shadowLvl3);
          transform: scale(0.9);
          opacity: 0;
          visibility: hidden;
          transition: opacity calc(var(--durationLvl2) - 50ms)
              var(--deceleratedEase),
            transform 0ms var(--deceleratedEase)
              calc(var(--durationLvl2) - 50ms),
            visibility calc(var(--durationLvl2) - 50ms) var(--deceleratedEase);
          will-change: opacity, transform;
        }

        :host(:dir(ltr)) {
          right: initial;
          left: 8px;
        }

        :host([place-over-app-bar='none']) {
          bottom: 8px;
        }

        :host([place-over-app-bar='normal']) {
          bottom: 64px;
        }

        :host([place-over-app-bar='tabs']) {
          bottom: 120px;
        }

        :host([place-over-app-bar='loading']) {
          bottom: 12px;
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

  #resizeDebouncer = new Debouncer();
  #activeTime = 6000;

  override get template(): WidgetTemplate {
    return html`
      <typography-widget variant="text" class="text"
        >${this.text}</typography-widget
      >
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
    this.#timer = setTimeout(
      () => snackbarStore.shiftQueue(),
      this.#activeTime,
    );
  }

  #deactivateRemoveTimer() {
    clearTimeout(this.#timer);
  }

  #getLongButtonTextValue() {
    const body = this.shadowRoot!.querySelector<ButtonWidget>('.button');
    return (body?.getBoundingClientRect().width ?? 0) > (innerWidth - 16) / 2;
  }

  #getPlaceOverAppBarValue() {
    const appBar = <AppBarWidget | undefined>(
      [
        ...(<HTMLElement[] | undefined>this.parentNode?.children ??
          <HTMLElement[]>[]),
      ].find((child) => child instanceof AppBarWidget)
    );

    return appBar?.variant === 'bottom' && appBar.active
      ? appBar.hasTabs
        ? 'tabs'
        : appBar.loading
        ? 'loading'
        : 'normal'
      : 'none';
  }

  #handleResize() {
    this.#resizeDebouncer.enqueue(
      () => (this.longButtonText = this.#getLongButtonTextValue()),
    );
  }

  #buttonAction() {
    this.button!.action();
    this.#deactivateRemoveTimer();

    snackbarStore.shiftQueue();
  }

  override addedCallback() {
    super.addedCallback();

    snackbarStore.runAndSubscribe(
      () => {
        const snackbar: SnackbarFinalInstance | undefined =
          snackbarStore.queue[0];

        if (this.#id !== snackbar?.id) {
          const fadeTime =
            Number(this.getCSSProperty('--durationLvl2').replace('ms', '')) -
            50;

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

    addEventListener('resize', this.#handleResize.bind(this), {
      signal: this.removedSignal,
    });
  }

  override updatedCallback() {
    super.updatedCallback();
    this.longButtonText = this.#getLongButtonTextValue();
    this.placeOverAppBar = this.#getPlaceOverAppBarValue();
  }
}
