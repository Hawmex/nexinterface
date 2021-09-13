import { repeat } from 'lit-html/directives/repeat.js';
import { Nexstate } from 'nexstate/nexstate.js';
import { css, html, nothing, WidgetTemplate } from 'nexwidget/nexwidget.js';
import { Nexinterface } from '../base/base.js';
import '../button/button.js';
import { ButtonWidget } from '../button/button.js';
import '../linear-progress/linear-progress.js';
import '../typography/typography.js';

export type AppBarVariant = 'top' | 'bottom';

export type AppBarLeading = { icon: string; action: () => void };

export type AppBarOptions = {
  headline: string;
  leading: AppBarLeading;
  trailing: WidgetTemplate;
  active: boolean;
  tabs: string[];
  activeTab: number;
};

const defualtState = <AppBarOptions>{
  headline: '',
  leading: { icon: 'arrow_forward', action: () => history.back() },
  trailing: nothing,
  active: true,
  tabs: [],
  activeTab: -1,
};

export const appBarOptions = new Nexstate(defualtState);

export const setAppBarOptions = (options: Partial<AppBarOptions>) =>
  appBarOptions.setState(() => ({ ...defualtState, ...options }));

declare global {
  interface HTMLElementTagNameMap {
    'app-bar-widget': AppBarWidget;
  }
}

export interface AppBarWidget {
  get active(): boolean;
  set active(v: boolean);

  get loading(): boolean;
  set loading(v: boolean);

  get appName(): string | null;
  set appName(v: string | null);

  get headline(): string | undefined;
  set headline(v: string | undefined);

  get trailing(): WidgetTemplate | undefined;
  set trailing(v: WidgetTemplate | undefined);

  get leading(): AppBarLeading | undefined;
  set leading(v: AppBarLeading | undefined);

  get tabs(): string[] | undefined;
  set tabs(v: string[] | undefined);

  get activeTab(): number | undefined;
  set activeTab(v: number | undefined);

  get hasTabs(): boolean;
  set hasTabs(v: boolean);

  get variant(): AppBarVariant | null;
  set variant(v: AppBarVariant | null);
}

export class AppBarWidget extends Nexinterface {
  static {
    this.createAttributes([
      { key: 'active', type: 'boolean' },
      { key: 'loading', type: 'boolean' },
      { key: 'appName', type: 'string' },
      { key: 'hasTabs', type: 'boolean' },
      { key: 'variant', type: 'string' },
    ]);

    this.createReactives(['headline', 'trailing', 'leading', 'loading', 'tabs', 'activeTab']);
    this.registerAs('app-bar-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          z-index: 1;
          overflow: hidden;
          position: relative;
          display: flex;
          gap: 8px;
          background: var(--surfaceColor);
          color: var(--primaryColor);
          box-shadow: var(--shadowLvl2);
          height: 0px;
          visibility: hidden;
          transition: transform calc(var(--durationLvl2) - 50ms) var(--deceleratedEase),
            visibility calc(var(--durationLvl2) - 50ms) var(--deceleratedEase),
            height calc(var(--durationLvl2) - 50ms) var(--deceleratedEase);
          will-change: transform, height;
        }

        :host([variant='top']) {
          flex-direction: column;
          transform: translateY(-100%);
        }

        :host([variant='bottom']) {
          flex-direction: column-reverse;
          transform: translateY(100%);
        }

        :host .containers {
          justify-content: space-between;
          align-items: center;
          display: flex;
          gap: 8px;
        }

        :host .container {
          display: none;
          grid-auto-flow: column;
          padding: 8px;
          gap: 8px;
          align-items: center;
        }

        :host([active]) {
          height: 56px;
          visibility: visible;
          transform: translateY(0%);
          transition-duration: var(--durationLvl2);
        }

        :host([active][has-tabs]) {
          height: 112px;
        }

        :host([active]) .container {
          display: grid;
        }

        :host([loading]:not([active])) {
          height: 4px;
          opacity: 1;
          visibility: visible;
          transition-duration: var(--durationLvl1);
          transition-delay: var(--durationLvl1);
        }

        :host([variant='top'][loading]) {
          transform: translateY(calc(-100% + 4px));
        }

        :host([variant='bottom'][loading]) {
          transform: translateY(calc(100% - 4px));
        }

        @keyframes tabs-pop {
          from {
            height: 0px;
          }

          to {
            height: 48px;
          }
        }

        :host .tabs {
          display: flex;
          scroll-behavior: smooth;
          position: relative;
          overflow-x: auto;
          overflow-y: hidden;
          align-self: center;
          width: max-content;
          max-width: 100vw;
          scroll-snap-type: x mandatory;
          scroll-padding: 32px;
          animation: tabs-pop var(--durationLvl1) var(--deceleratedEase) forwards;
        }

        :host .tabs-container {
          display: grid;
          gap: 8px;
          padding: 0px 8px;
          width: max-content;
          grid-auto-flow: column;
        }

        :host .tab {
          width: max-content;
          min-height: 48px;
          padding: 0px 8px;
          white-space: nowrap;
          min-width: unset;
          scroll-snap-align: center;
        }

        :host([variant='top']) .tab {
          border-radius: 4px 4px 0px 0px;
        }

        :host([variant='bottom']) .tab {
          border-radius: 0px 0px 4px 4px;
        }

        :host .tab:not(.active) {
          color: var(--onSurfaceColor);
        }

        :host .tab-indicator {
          position: absolute;
          left: 0px;
          width: var(--tabIndicatorWidth, 0px);
          transform: translateX(calc(var(--tabIndicatorX, 0px) - 50%));
          height: 4px;
          display: block;
          background: var(--primaryColor);
          transition: transform var(--durationLvl2) var(--deceleratedEase),
            width var(--durationLvl2) var(--deceleratedEase),
            opacity var(--durationLvl2) var(--deceleratedEase);
        }

        :host([variant='top']) .tab-indicator {
          bottom: 0px;
          border-radius: 4px 4px 0px 0px;
        }

        :host([variant='bottom']) .tab-indicator {
          border-radius: 0px 0px 4px 4px;
          top: 0px;
        }

        :host([loading]) .tab-indicator {
          opacity: 0;
        }

        :host .progress-bar {
          border-radius: 0px;
          width: 100vw;
          position: absolute;
          right: 0px;
        }

        :host([variant='top']) .progress-bar {
          bottom: 0px;
          transform-origin: bottom;
        }

        :host([variant='bottom']) .progress-bar {
          top: 0px;
          transform-origin: top;
        }
      `,
    ];
  }

  override get template(): WidgetTemplate {
    return html`
      <div class="containers">
        <div class="container">
          <button-widget
            variant="text"
            icon=${this.leading!.icon}
            @click=${this.leading!.action}
          ></button-widget>
          <typography-widget one-line variant="app-bar">${this.headline}</typography-widget>
        </div>
        <div class="container">${this.trailing}</div>
      </div>
      ${this.tabs!.length > 0
        ? html`
            <div class="tabs">
              <div class="tabs-container">
                ${repeat(
                  this.tabs!,
                  (tab) => tab,
                  (tab, index) => html`
                    <button-widget
                      @click=${() => this.#activateTab(index)}
                      class=${`tab ${this.activeTab === index ? 'active' : ''}`}
                      variant="text"
                      text=${tab}
                    ></button-widget>
                  `,
                )}
              </div>
              <div class="tab-indicator"></div>
            </div>
          `
        : nothing}
      <linear-progress-widget ?active=${this.loading} class="progress-bar"></linear-progress-widget>
    `;
  }

  #setWindowTitle() {
    document.title = this.headline ? `${this.appName} - ${this.headline}` : `${this.appName}`;
  }

  #activateTab(index: number) {
    setAppBarOptions({ ...appBarOptions.state, activeTab: index });
  }

  #scrollActiveTabIntoView() {
    const tab = <ButtonWidget | undefined>(
      this.shadowRoot!.querySelectorAll<ButtonWidget>('.tab')?.[this.activeTab!]
    );

    tab?.scrollIntoView?.({ inline: 'center', block: 'nearest' });
  }

  #moveTabIndicator() {
    const tab = <ButtonWidget | undefined>(
      this.shadowRoot!.querySelectorAll<ButtonWidget>('.tab')?.[this.activeTab!]
    );

    const tabs = this.shadowRoot!.querySelector<HTMLDivElement>('.tabs');

    if (tab !== undefined) {
      const { width: tabWidth, left: tabLeft } = tab.getBoundingClientRect();
      const { left: tabsLeft } = tabs!.getBoundingClientRect();

      const tabTextWidth = tabWidth - 16;

      this.style.setProperty(
        '--tabIndicatorX',
        `${tabLeft + 8 - tabsLeft + tabTextWidth / 2 + tabs!.scrollLeft}px`,
      );

      this.style.setProperty('--tabIndicatorWidth', `${tabTextWidth}px`);
    }
  }

  override addedCallback() {
    super.addedCallback();

    appBarOptions.runAndSubscribe(
      ({ headline, trailing, active, leading, tabs, activeTab }) => {
        this.headline = headline;
        this.trailing = trailing;
        this.active = active;
        this.leading = leading;
        this.tabs = tabs;
        this.activeTab = activeTab;
        this.hasTabs = tabs.length > 0;
      },
      { signal: this.removedSignal },
    );

    addEventListener('resize', this.#moveTabIndicator.bind(this), { signal: this.removedSignal });
  }

  override updatedCallback() {
    super.updatedCallback();
    this.#setWindowTitle();
    this.#scrollActiveTabIntoView();
    this.#moveTabIndicator();
  }
}
