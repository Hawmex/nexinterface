import { Nexbounce } from 'nexbounce';
import { Nexstate } from 'nexstate';
import { css, html, nothing, WidgetTemplate } from 'nexwidget';
import { Nexinterface } from '../base/base.js';
import '../button/button.js';
import '../divider/divider.js';
import '../scrim/scrim.js';
import '../section/section.js';
import { SectionWidget } from '../section/section.js';
import '../typography/typography.js';

export type DialogButton = {
  text: string;
  action: () => void;
};

export type DialogInstance = {
  headline: string;
  body: WidgetTemplate;
  button?: DialogButton;
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

  get headline(): string | undefined;
  set headline(v: string | undefined);

  get body(): WidgetTemplate | undefined;
  set body(v: WidgetTemplate | undefined);

  get button(): DialogButton | undefined;
  set button(v: DialogButton | undefined);
}

export class DialogWidget extends Nexinterface {
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

  #id?: symbol;

  #resizeDebouncer = new Nexbounce();

  addedCallback() {
    super.addedCallback();

    dialogsQueue.runAndSubscribe(
      ([dialog]: Array<DialogFinalInstance | undefined>) => {
        if (this.#id !== dialog?.id) {
          const fadeTime = Number(this.getCSSProperty('--durationLvl2').replace('ms', '')) - 50;

          this.active = false;

          setTimeout(() => {
            this.#id = dialog?.id;

            this.headline = dialog?.headline;
            this.body = dialog?.body;
            this.button = dialog?.button;

            this.active = !!dialog;
          }, fadeTime);
        }
      },
      { signal: this.removedSignal },
    );

    addEventListener('resize', this.#handleResize.bind(this), { signal: this.removedSignal });
    addEventListener('pushstate', removeDialog, { signal: this.removedSignal });
    addEventListener('popstate', removeDialog, { signal: this.removedSignal });
    addEventListener('replacestate', removeDialog, { signal: this.removedSignal });
  }

  updatedCallback() {
    super.updatedCallback();
    this.scrollable = this.#getScrollableValue();
  }

  get template(): WidgetTemplate {
    return html`
      <scrim-widget ?active=${this.active} @pointerdown=${removeDialog}></scrim-widget>
      <div class="dialog">
        <section-widget class="header" variant="paragraphs">
          <typography-widget variant="headline"> ${this.headline} </typography-widget>
        </section-widget>
        ${this.scrollable ? html`<divider-widget></divider-widget>` : nothing}
        <section-widget class="body" variant="paragraphs"> ${this.body} </section-widget>
        ${this.button
          ? html`
              ${this.scrollable ? html`<divider-widget></divider-widget>` : nothing}
              <section-widget class="footer" variant="buttons">
                <button-widget
                  slot="trailing"
                  variant="text"
                  text=${this.button.text}
                  @click=${this.#buttonAction.bind(this)}
                ></button-widget>
              </section-widget>
            `
          : nothing}
      </div>
    `;
  }

  #buttonAction() {
    this.button!.action();
    removeDialog();
  }

  #getScrollableValue() {
    const { scrollHeight, clientHeight } = <SectionWidget>this.shadowRoot!.querySelector('.body');
    return scrollHeight > clientHeight;
  }

  #handleResize() {
    this.#resizeDebouncer.enqueue(() => (this.scrollable = this.#getScrollableValue()));
  }
}

DialogWidget.createAttributes([
  { key: 'active', type: 'boolean' },
  { key: 'scrollable', type: 'boolean' },
]);

DialogWidget.createReactives(['active', 'scrollable', 'headline', 'body', 'button']);
DialogWidget.register('dialog-widget');
