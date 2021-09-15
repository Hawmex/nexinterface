import { Nexstate } from 'nexstate/nexstate.js';
import { css, html, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';
import { ButtonWidget } from '../button/button.js';
import './menu-container.js';

export const menuBody = new Nexstate<WidgetTemplate | null>(null);

export const setMenuBody = (body: WidgetTemplate | null) => menuBody.setState(() => body);

declare global {
  interface HTMLElementTagNameMap {
    'menu-widget': MenuWidget;
  }
}

export interface MenuWidget {
  get body(): WidgetTemplate | null | undefined;
  set body(v: WidgetTemplate | null | undefined);

  get active(): boolean;
  set active(v: boolean);
}

export class MenuWidget extends Nexinterface {
  static {
    this.createAttributes([{ key: 'active', type: 'boolean' }]);
    this.createReactives(['body', 'active']);
    this.registerAs('menu-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host .menu {
          position: absolute;
          bottom: 0px;
          right: 0px;
          border-radius: 8px 8px 0px 0px;
          overflow: hidden;
          z-index: 2;
          height: auto;
          max-height: 50vh;
          width: 100vw;
          display: flex;
          visibility: hidden;
          transform: translateY(100%);
          transition: transform calc(var(--durationLvl2) - 50ms) var(--deceleratedEase),
            visibility calc(var(--durationLvl2) - 50ms) var(--deceleratedEase);
          will-change: transform;
        }

        :host([active]) .menu {
          transform: translateY(0%);
          visibility: visible;
          transition-duration: var(--durationLvl2);
        }

        :host menu-container-widget {
          overflow-y: auto;
        }
      `,
    ];
  }

  #timeout?: number;

  override get template(): WidgetTemplate {
    return html`
      <scrim-widget
        @pointerdown=${this.#deactivate.bind(this)}
        ?active=${this.active}
      ></scrim-widget>
      <div class="menu">
        <menu-container-widget
          @click=${(event: MouseEvent) =>
            event.target instanceof ButtonWidget && this.#deactivate()}
        >
          ${this.body}
        </menu-container-widget>
      </div>
    `;
  }

  #deactivate() {
    setMenuBody(null);
  }

  override addedCallback() {
    super.addedCallback();

    menuBody.runAndSubscribe((body) => {
      clearTimeout(this.#timeout);

      if (body !== null) {
        this.body = body;
        this.active = true;
      } else {
        const transitionTime = Number(this.getCSSProperty('--durationLvl2').replace('ms', '')) - 50;

        this.active = false;
        this.#timeout = setTimeout(() => (this.body = body), transitionTime);
      }
    });

    addEventListener('pushstate', this.#deactivate.bind(this), { signal: this.removedSignal });
    addEventListener('popstate', this.#deactivate.bind(this), { signal: this.removedSignal });
    addEventListener('replacestate', this.#deactivate.bind(this), { signal: this.removedSignal });
  }
}
