import { repeat } from 'lit-html/directives/repeat.js';
import { Nexstate } from 'nexstate';
import { css, html, nothing, WidgetTemplate } from 'nexwidget';
import { Nexinterface } from '../base/base.js';
import '../button/button.js';
import { ButtonWidget } from '../button/button.js';
import '../linear-progress/linear-progress.js';
import '../typography/typography.js';

export type TopBarLeading = {
  icon: string;
  action: () => void;
};

export type TopBarOptions = {
  headline: string;
  leading: TopBarLeading;
  trailing: WidgetTemplate;
  active: boolean;
  tabs: string[];
  activeTab: number;
};

const defualtState = <TopBarOptions>{
  headline: '',
  leading: {
    icon: 'arrow_forward',
    action: () => history.back(),
  },
  trailing: nothing,
  active: true,
  tabs: [],
  activeTab: -1,
};

export const topBarOptions = new Nexstate(defualtState);

export const setTopBarOptions = (options: Partial<TopBarOptions>) =>
  topBarOptions.setState(() => ({ ...defualtState, ...options }));

declare global {
  interface HTMLElementTagNameMap {
    'top-bar-widget': TopBarWidget;
  }
}

export interface TopBarWidget {
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

  get leading(): TopBarLeading | undefined;
  set leading(v: TopBarLeading | undefined);

  get tabs(): string[] | undefined;
  set tabs(v: string[] | undefined);

  get activeTab(): number | undefined;
  set activeTab(v: number | undefined);
}

export class TopBarWidget extends Nexinterface {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          z-index: 1;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--surfaceColor);
          color: var(--primaryColor);
          box-shadow: var(--shadowLvl2);
          height: 0px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-100%);
          transition: opacity calc(var(--durationLvl2) - 50ms) var(--deceleratedEase),
            transform calc(var(--durationLvl2) - 50ms) var(--deceleratedEase),
            visibility calc(var(--durationLvl2) - 50ms) var(--deceleratedEase),
            height calc(var(--durationLvl2) - 50ms) var(--deceleratedEase);
          will-change: opacity, transform, height;
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
          height: auto;
          opacity: 1;
          visibility: visible;
          transform: translateY(0%);
          transition-duration: var(--durationLvl2);
        }

        :host([active]) .container {
          display: grid;
        }

        :host([loading]:not([active])) {
          height: 4px;
          opacity: 1;
          visibility: visible;
          transform: translateY(calc(-100% + 4px));
          transition-duration: var(--durationLvl1);
          transition-delay: var(--durationLvl1);
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
          border-radius: 4px 4px 0px 0px;
          width: max-content;
          min-height: 48px;
          padding: 0px 8px;
          white-space: nowrap;
          min-width: unset;
          scroll-snap-align: center;
        }

        :host .tab:not(.active) {
          color: var(--onSurfaceColor);
        }

        :host .tab-indicator {
          position: absolute;
          left: 0px;
          width: var(--tabIndicatorWidth, 0px);
          transform: translateX(calc(var(--tabIndicatorX, 0px) - 50%));
          bottom: 0px;
          height: 4px;
          border-radius: 4px 4px 0px 0px;
          display: block;
          background: var(--primaryColor);
          transition: transform var(--durationLvl2) var(--deceleratedEase),
            width var(--durationLvl2) var(--deceleratedEase),
            opacity var(--durationLvl2) var(--deceleratedEase);
        }

        :host([loading]) .tab-indicator {
          opacity: 0;
        }

        :host .progress-bar {
          border-radius: 0px;
          width: 100vw;
          position: absolute;
          right: 0px;
          bottom: 0px;
          transform-origin: bottom;
        }
      `,
    ];
  }

  addedCallback() {
    super.addedCallback();

    topBarOptions.runAndSubscribe(
      ({ headline, trailing, active, leading, tabs, activeTab }) => {
        this.headline = headline;
        this.trailing = trailing;
        this.active = active;
        this.leading = leading;
        this.tabs = tabs;
        this.activeTab = activeTab;
      },
      { signal: this.removedSignal },
    );

    addEventListener('resize', this.#moveTabIndicator.bind(this), { signal: this.removedSignal });
  }

  updatedCallback() {
    super.updatedCallback();
    this.#setWindowTitle();
    this.#scrollActiveTabIntoView();
    this.#moveTabIndicator();
  }

  get template(): WidgetTemplate {
    return html`
      <div class="containers">
        <div class="container">
          <button-widget
            variant="text"
            icon=${this.leading!.icon}
            @click=${this.leading!.action}
          ></button-widget>
          <typography-widget one-line variant="top-bar">${this.headline}</typography-widget>
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
    setTopBarOptions({
      ...topBarOptions.state,
      activeTab: index,
    });
  }

  #scrollActiveTabIntoView() {
    const tab = <ButtonWidget | undefined>(
      this.shadowRoot!.querySelectorAll('.tab')?.[this.activeTab!]
    );

    tab?.scrollIntoView?.({ inline: 'center', block: 'nearest' });
  }

  #moveTabIndicator() {
    const tab = <ButtonWidget | undefined>(
      this.shadowRoot!.querySelectorAll('.tab')?.[this.activeTab!]
    );

    const tabs = <HTMLDivElement | null>this.shadowRoot!.querySelector('.tabs');

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
}

TopBarWidget.createAttributes([
  { key: 'active', type: 'boolean' },
  { key: 'loading', type: 'boolean' },
  { key: 'appName', type: 'string' },
]);

TopBarWidget.createReactives(['headline', 'trailing', 'leading', 'loading', 'tabs', 'activeTab']);
TopBarWidget.registerAs('top-bar-widget');
