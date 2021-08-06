import { Nexbounce } from 'nexbounce';
import { Nexstate } from 'nexstate';
import { css, html, Nexwidget, NexwidgetTemplate, nothing } from 'nexwidget';
import '../button/button.js';
import '../divider/divider.js';
import '../scrim/scrim.js';
import '../section/section.js';
import '../typography/typography.js';

export type DialogInstance = {
  headline: string;
  body: NexwidgetTemplate;
  onCancel?: () => void;
  button?: {
    text: string;
    action: () => void;
  };
};

export type DialogFinalInstance = {
  id: symbol;
} & DialogInstance;

export const dialogsQueue = new Nexstate<DialogFinalInstance[]>([]);

const removeDialog = () => dialogsQueue.setState((state) => state.slice(1));

export const addDialog = (dialog: DialogInstance) =>
  dialogsQueue.setState((state) => [...state, { ...dialog, id: Symbol(dialog.headline) }]);

declare global {
  interface HTMLElementTagNameMap {
    'dialog-widget': DialogWidget;
  }
}

export interface DialogWidget {
  get active(): boolean;
  set active(v: boolean);

  get scrollable(): boolean;
  set scrollable(v: boolean);

  get value(): DialogFinalInstance;
  set value(v: DialogFinalInstance);
}

export class DialogWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          --dialogWidth: 360px;
        }

        @media (max-width: 640px) {
          :host {
            --dialogWidth: calc(100vw - 32px);
          }
        }

        :host .dialog {
          box-sizing: border-box;
          position: absolute;
          grid-template-rows: max-content 1fr max-content;
          display: grid;
          z-index: 2;
          top: 50%;
          right: 50%;
          transform: translate(50%, -50%) scale(0.9);
          background: var(--surfaceColor);
          color: var(--onSurfaceColor);
          border-radius: 8px;
          box-shadow: var(--shadowLvl4);
          width: var(--dialogWidth);
          max-height: calc(100vh - 32px);
          visibility: hidden;
          opacity: 0;
          transition: opacity calc(var(--durationLvl2) - 50ms) var(--deceleratedEase),
            transform 0ms var(--deceleratedEase) calc(var(--durationLvl2) - 50ms),
            visibility calc(var(--durationLvl2) - 50ms) var(--deceleratedEase);
          will-change: opacity, transform;
        }

        :host([active]) .dialog {
          transform: translate(50%, -50%) scale(1);
          visibility: visible;
          opacity: 1;
          transition: opacity var(--durationLvl2) var(--deceleratedEase),
            transform var(--durationLvl2) var(--deceleratedEase),
            visibility var(--durationLvl2) var(--deceleratedEase);
        }

        :host([scrollable]) .dialog {
          grid-template-rows: max-content 1px 1fr 1px max-content;
        }

        :host .header {
          padding: 16px 0px 8px 0px;
          min-height: 56px;
          justify-content: center;
        }

        :host .body {
          padding: 0px 0px 16px 0px;
          overflow-y: auto;
        }

        :host .footer {
          padding: 0px 8px 8px 8px;
        }

        :host .body,
        :host .header,
        :host .footer {
          transition: padding var(--durationLvl1) var(--deceleratedEase);
          will-change: padding;
        }

        :host([scrollable]) .header {
          padding: 16px 0px;
        }

        :host([scrollable]) .body {
          padding: 8px 0px;
        }

        :host([scrollable]) .footer {
          padding: 8px;
        }
      `,
    ];
  }

  #resizeDebouncer = new Nexbounce();

  addedCallback() {
    super.addedCallback();

    dialogsQueue.runAndSubscribe(
      ([dialog]) => {
        const fadeTime = Number(this.getCSSProperty('--durationLvl2').replace('ms', '')) - 50;

        if (this.value?.id !== dialog?.id) {
          this.active = false;

          setTimeout(() => {
            this.value = dialog;
            this.active = !!dialog;
          }, fadeTime);
        }
      },
      { signal: this.removedSignal },
    );

    addEventListener('resize', this.#handleResize.bind(this), { signal: this.removedSignal });
    addEventListener('pushstate', this.#deactivate.bind(this), { signal: this.removedSignal });
    addEventListener('popstate', this.#deactivate.bind(this), { signal: this.removedSignal });
    addEventListener('replacestate', this.#deactivate.bind(this), { signal: this.removedSignal });
  }

  updatedCallback() {
    super.updatedCallback();
    this.scrollable = this.#getScrollableValue();
  }

  get template(): NexwidgetTemplate {
    return html`
      <scrim-widget
        ?active=${this.active}
        @pointerdown=${this.#deactivate.bind(this)}
      ></scrim-widget>
      <div class="dialog">
        <section-widget class="header" variant="paragraphs">
          <typography-widget variant="headline"> ${this.value?.headline} </typography-widget>
        </section-widget>
        ${this.scrollable ? html`<divider-widget></divider-widget>` : nothing}
        <section-widget class="body" variant="paragraphs"> ${this.value?.body} </section-widget>
        ${this.value?.button?.text
          ? html`
              ${this.scrollable ? html`<divider-widget></divider-widget>` : nothing}
              <section-widget class="footer" variant="buttons">
                <button-widget
                  slot="buttons"
                  variant="text"
                  text=${this.value.button.text}
                  @click=${this.#buttonAction.bind(this)}
                ></button-widget>
              </section-widget>
            `
          : nothing}
      </div>
    `;
  }

  #buttonAction() {
    this.value.button?.action?.();
    this.#deactivate();
  }

  #deactivate() {
    this.value?.onCancel?.();
    removeDialog();
  }

  #getScrollableValue() {
    return this.shadowRoot!.querySelector('.body')!.scrollHeight >
      this.shadowRoot!.querySelector('.body')!.clientHeight
      ? true
      : false;
  }

  #handleResize() {
    this.#resizeDebouncer.enqueue(() => (this.scrollable = this.#getScrollableValue()));
  }
}

DialogWidget.createAttributes([
  ['active', Boolean],
  ['scrollable', Boolean],
]);

DialogWidget.createReactives(['active', 'value', 'scrollable']);
DialogWidget.register('dialog-widget');
