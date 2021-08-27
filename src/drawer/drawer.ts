import { Nexbounce } from 'nexbounce';
import { Nexstate } from 'nexstate';
import { css, html, nothing, WidgetTemplate } from 'nexwidget';
import { Nexinterface } from '../base/base.js';
import '../divider/divider.js';
import '../menu/menu-container.js';
import '../scrim/scrim.js';
import '../typography/typography.js';

export const drawerActive = new Nexstate(false);

export const deactivateDrawer = () => drawerActive.setState(() => false);
export const activateDrawer = () => drawerActive.setState(() => true);

declare global {
  interface HTMLElementTagNameMap {
    'drawer-widget': DrawerWidget;
  }
}

export interface DrawerWidget {
  get headline(): string | null;
  set headline(v: string | null);

  get text(): string | null;
  set text(v: string | null);

  get active(): boolean;
  set active(v: boolean);

  get scrollable(): boolean;
  set scrollable(v: boolean);
}

export class DrawerWidget extends Nexinterface {
  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          --drawerWidth: 256px;
        }

        @media (max-width: 640px) {
          :host {
            --drawerWidth: calc(100vw - 56px);
          }
        }

        @media (max-width: 640px) and (orientation: landscape) {
          :host {
            --drawerWidth: 50vw;
          }
        }

        :host .drawer {
          background: var(--surfaceColor);
          color: var(--onSurfaceColor);
          width: var(--drawerWidth);
          height: 100vh;
          overflow: hidden;
          display: grid;
          grid-template-rows: 64px 1fr;
          position: fixed;
          z-index: 2;
          top: 0px;
          right: 0px;
          transform: translateX(100%);
          visibility: hidden;
          transition: transform calc(var(--durationLvl3) - 50ms) var(--deceleratedEase),
            visibility calc(var(--durationLvl3) - 50ms) var(--deceleratedEase);
          will-change: transform;
          box-shadow: var(--shadowLvl4);
        }

        :host .drawer:dir(ltr) {
          left: 0px;
          right: initial;
          transform: translateX(-100%);
        }

        :host([scrollable]) .drawer {
          grid-template-rows: 64px 1px 1fr;
        }

        :host .scrim {
          transition-duration: calc(var(--durationLvl3) - 50ms);
        }

        :host([active]) .scrim {
          transition-duration: var(--durationLvl3);
        }

        :host([active]) .drawer {
          visibility: visible;
          transform: translateX(0%);
          transition-duration: var(--durationLvl3);
        }

        :host .header {
          display: flex;
          padding: 0px 16px;
          align-items: center;
          width: inherit;
          justify-content: flex-start;
        }

        :host .header-content {
          width: 100%;
        }

        :host .headline,
        :host .text {
          padding: 0px;
        }

        :host .list {
          box-sizing: border-box;
          overflow-y: auto;
        }
      `,
    ];
  }

  #resizeDebouncer = new Nexbounce();

  override addedCallback() {
    super.addedCallback();

    drawerActive.runAndSubscribe((drawerActive) => (this.active = drawerActive), {
      signal: this.removedSignal,
    });

    addEventListener('pushstate', deactivateDrawer, { signal: this.removedSignal });
    addEventListener('popstate', deactivateDrawer, { signal: this.removedSignal });
    addEventListener('replacestate', deactivateDrawer, { signal: this.removedSignal });
    addEventListener('resize', this.#handleResize.bind(this), { signal: this.removedSignal });
  }

  override slotChangedCallback() {
    super.slotChangedCallback();
    this.scrollable = this.#getScrollableValue();
  }

  override get template(): WidgetTemplate {
    return html`
      <scrim-widget
        class="scrim"
        ?active=${this.active}
        @pointerdown=${deactivateDrawer}
      ></scrim-widget>
      <div class="drawer">
        <div class="header">
          <div class="header-content">
            <typography-widget one-line variant="headline" class="headline">
              ${this.headline}
            </typography-widget>
            <typography-widget one-line variant="text" class="text">${this.text}</typography-widget>
          </div>
        </div>
        ${this.scrollable ? html`<divider-widget></divider-widget>` : nothing}
        <div class="list">
          <menu-container-widget>
            <slot></slot>
          </menu-container-widget>
        </div>
      </div>
    `;
  }

  #getScrollableValue() {
    const { scrollHeight, clientHeight } = this.shadowRoot!.querySelector<HTMLDivElement>('.list')!;
    return scrollHeight > clientHeight;
  }

  #handleResize() {
    this.#resizeDebouncer.enqueue(() => (this.scrollable = this.#getScrollableValue()));
  }
}

DrawerWidget.createAttributes([
  { key: 'headline', type: 'string' },
  { key: 'text', type: 'string' },
  { key: 'active', type: 'boolean' },
  { key: 'scrollable', type: 'boolean' },
]);

DrawerWidget.createReactives(['headline', 'text', 'active', 'scrollable']);
DrawerWidget.registerAs('drawer-widget');
