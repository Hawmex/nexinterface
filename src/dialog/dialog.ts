import { Debouncer } from 'nexbounce/nexbounce';
import { Store } from 'nexstate/nexstate.js';
import { css, html, nothing, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';
import '../button/button.js';
import '../divider/divider.js';
import '../scrim/scrim.js';
import '../section/section.js';
import '../typography/typography.js';

export type DialogButton = { text: string; action: () => void };

export type DialogInstance = {
  headline: string;
  body: WidgetTemplate;
  button?: DialogButton;
};

export type DialogFinalInstance = { id: symbol } & DialogInstance;

export class DialogStore extends Store {
  queue: DialogFinalInstance[] = [];

  pushQueue(dialog: DialogInstance) {
    this.setState(() =>
      this.queue.push({ ...dialog, id: Symbol(dialog.headline) }),
    );
  }

  shiftQueue() {
    this.setState(() => this.queue.shift());
  }
}

export const dialogStore = new DialogStore();

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
  static {
    this.createAttributes([
      { key: 'active', type: 'boolean' },
      { key: 'scrollable', type: 'boolean' },
    ]);

    this.createReactives([
      'active',
      'scrollable',
      'headline',
      'body',
      'button',
    ]);
    this.registerAs('dialog-widget');
  }

  static override get styles(): CSSStyleSheet[] {
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
          overflow: hidden;
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
          transition: opacity calc(var(--durationLvl2) - 50ms)
              var(--deceleratedEase),
            transform 0ms var(--deceleratedEase)
              calc(var(--durationLvl2) - 50ms),
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
          padding: 16px 0px 0px 0px;
          min-height: 56px;
          justify-content: center;
        }

        :host .body {
          overflow-y: auto;
        }

        :host .footer {
          padding: 0px 8px 8px 8px;
        }

        :host .header,
        :host .footer {
          transition: padding var(--durationLvl1) var(--deceleratedEase);
          will-change: padding;
        }

        :host([scrollable]) .header {
          padding: 16px 0px;
        }

        :host([scrollable]) .footer {
          padding: 8px;
        }
      `,
    ];
  }

  #id?: symbol;
  #resizeDebouncer = new Debouncer();

  override get template(): WidgetTemplate {
    return html`
      <scrim-widget
        ?active=${this.active}
        @pointerdown=${() => dialogStore.shiftQueue()}
      ></scrim-widget>
      <div class="dialog">
        <section-widget class="header" variant="paragraphs">
          <typography-widget variant="headline">
            ${this.headline}
          </typography-widget>
        </section-widget>
        ${this.scrollable ? html`<divider-widget></divider-widget>` : nothing}
        <div class="body">${this.body}</div>
        ${this.button
          ? html`
              ${this.scrollable
                ? html`<divider-widget></divider-widget>`
                : nothing}
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
    dialogStore.shiftQueue();
  }

  #getScrollableValue() {
    const { scrollHeight, clientHeight } =
      this.shadowRoot!.querySelector<HTMLDivElement>('.body')!;
    return scrollHeight > clientHeight;
  }

  #handleResize() {
    this.#resizeDebouncer.enqueue(
      () => (this.scrollable = this.#getScrollableValue()),
    );
  }

  override addedCallback() {
    super.addedCallback();

    dialogStore.runAndSubscribe(
      () => {
        const dialog: DialogFinalInstance | undefined = dialogStore.queue[0];

        if (this.#id !== dialog?.id) {
          const fadeTime =
            Number(this.getCSSProperty('--durationLvl2').replace('ms', '')) -
            50;

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

    addEventListener('resize', this.#handleResize.bind(this), {
      signal: this.removedSignal,
    });

    addEventListener('pushstate', () => dialogStore.shiftQueue(), {
      signal: this.removedSignal,
    });

    addEventListener('popstate', () => dialogStore.shiftQueue(), {
      signal: this.removedSignal,
    });

    addEventListener('replacestate', () => dialogStore.shiftQueue(), {
      signal: this.removedSignal,
    });
  }

  override updatedCallback() {
    super.updatedCallback();
    this.scrollable = this.#getScrollableValue();
  }
}
