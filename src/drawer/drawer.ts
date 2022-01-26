import { Debouncer } from 'nexbounce/nexbounce';
import { Store } from 'nexstate/nexstate.js';
import { css, html, nothing, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';
import { ButtonWidget } from '../button/button.js';
import '../divider/divider.js';
import '../menu/menu-container.js';
import '../scrim/scrim.js';
import '../typography/typography.js';

export type DrawerVariant = 'side' | 'bottom';

export class DrawerStore extends Store {
  isActive = false;

  activate() {
    this.setState(() => (this.isActive = true));
  }

  deactivate() {
    this.setState(() => (this.isActive = false));
  }
}

export const drawerStore = new DrawerStore();

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

  get variant(): DrawerVariant | null;
  set variant(v: DrawerVariant | null);
}

export class DrawerWidget extends Nexinterface {
  static {
    this.createAttributes([
      { key: 'headline', type: 'string' },
      { key: 'text', type: 'string' },
      { key: 'active', type: 'boolean' },
      { key: 'scrollable', type: 'boolean' },
      { key: 'variant', type: 'string' },
    ]);

    this.createReactives(['headline', 'text', 'active', 'scrollable']);
    this.registerAs('drawer-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host([variant='side']) {
          --drawerWidth: 256px;
          --drawerHeight: 100vh;
        }

        :host([variant='bottom']) {
          --drawerWidth: 100vw;
          --drawerHeight: 50vh;
        }

        @media (max-width: 640px) {
          :host([variant='side']) {
            --drawerWidth: calc(100vw - 56px);
          }
        }

        @media (max-width: 640px) and (orientation: landscape) {
          :host([variant='side']) {
            --drawerWidth: 50vw;
          }
        }

        :host .drawer {
          background: var(--surfaceColor);
          color: var(--onSurfaceColor);
          width: var(--drawerWidth);
          overflow: hidden;
          display: grid;
          grid-template-rows: 64px 1fr;
          position: absolute;
          z-index: 2;
          visibility: hidden;
          transition: transform calc(var(--durationLvl3) - 50ms)
              var(--deceleratedEase),
            visibility calc(var(--durationLvl3) - 50ms) var(--deceleratedEase);
          will-change: transform;
          box-shadow: var(--shadowLvl4);
        }

        :host([variant='side']) .drawer {
          top: 0px;
          right: 0px;
          transform: translateX(100%);
          height: var(--drawerHeight);
        }

        :host([variant='bottom']) .drawer {
          bottom: 0px;
          right: 0px;
          transform: translateY(100%);
          height: auto;
          max-height: var(--drawerHeight);
          border-radius: 8px 8px 0px 0px;
        }

        :host([variant='side']) .drawer:dir(ltr) {
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
          transition-duration: var(--durationLvl3);
        }

        :host([active][variant='side']) .drawer {
          transform: translateX(0%);
        }

        :host([active][variant='bottom']) .drawer {
          transform: translateY(0%);
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

  #resizeDebouncer = new Debouncer();

  override get template(): WidgetTemplate {
    return html`
      <scrim-widget
        class="scrim"
        ?active=${this.active}
        @pointerdown=${() => drawerStore.deactivate()}
      ></scrim-widget>
      <div class="drawer">
        <div class="header">
          <div class="header-content">
            <typography-widget one-line variant="headline" class="headline">
              ${this.headline}
            </typography-widget>
            <typography-widget one-line variant="text" class="text"
              >${this.text}</typography-widget
            >
          </div>
        </div>
        ${this.scrollable ? html`<divider-widget></divider-widget>` : nothing}
        <div class="list">
          <menu-container-widget
            @click=${(event: MouseEvent) =>
              event.target instanceof ButtonWidget && drawerStore.deactivate()}
          >
            <slot></slot>
          </menu-container-widget>
        </div>
      </div>
    `;
  }

  #getScrollableValue() {
    const { scrollHeight, clientHeight } =
      this.shadowRoot!.querySelector<HTMLDivElement>('.list')!;
    return scrollHeight > clientHeight;
  }

  #handleResize() {
    this.#resizeDebouncer.enqueue(
      () => (this.scrollable = this.#getScrollableValue()),
    );
  }

  override addedCallback() {
    super.addedCallback();

    drawerStore.runAndSubscribe(() => (this.active = drawerStore.isActive), {
      signal: this.removedSignal,
    });

    addEventListener('pushstate', () => drawerStore.deactivate(), {
      signal: this.removedSignal,
    });
    addEventListener('popstate', () => drawerStore.deactivate(), {
      signal: this.removedSignal,
    });
    addEventListener('replacestate', () => drawerStore.deactivate(), {
      signal: this.removedSignal,
    });
    addEventListener('resize', this.#handleResize.bind(this), {
      signal: this.removedSignal,
    });
  }

  override slotChangedCallback() {
    super.slotChangedCallback();
    this.scrollable = this.#getScrollableValue();
  }
}
