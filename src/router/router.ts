import { css, html, Nexwidget, NexwidgetTemplate } from 'nexwidget';
import { lazyLoad } from 'nexwidget/dist/directives/lazyload.js';
import { parse } from 'regexparam';

const assignParams = (path: string, { keys, pattern }: { keys: string[]; pattern: RegExp }) => {
  let i = 0;
  const out: LocationParams = {};
  const matches = pattern.exec(path);

  while (i < keys.length) out[keys[i]] = Array.isArray(matches) ? matches[++i] : null;

  return out;
};

type LocationParams = {
  [key: string]: any;
};

declare global {
  interface HTMLElementTagNameMap {
    'router-widget': RouterWidget;
  }

  interface Location {
    params: LocationParams;
  }
}

export interface RouterWidget {
  get src(): () => Promise<{ default: any }>;
  set src(v: () => Promise<{ default: any }>);

  get component(): string;
  set component(v: string);

  get loose(): boolean;
  set loose(v: boolean);
}

export class RouterWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          overflow-y: auto;
          scroll-behavior: smooth;
          box-sizing: border-box;
        }
      `,
    ];
  }

  addedCallback() {
    super.addedCallback();

    History.prototype.pushState = ((defaultFn) =>
      function (this: History, data: any, title: string, url?: string | null | undefined) {
        defaultFn.call(this, data, title, url);
        dispatchEvent(new CustomEvent('pushstate', { composed: true, bubbles: true }));
      })(History.prototype.pushState);

    History.prototype.replaceState = ((defaultFn) =>
      function (this: History, data: any, title: string, url?: string | null | undefined) {
        defaultFn.call(this, data, title, url);
        dispatchEvent(new CustomEvent('replacestate', { composed: true, bubbles: true }));
      })(History.prototype.replaceState);

    addEventListener('popstate', this.#computeMatching.bind(this), { signal: this.removedSignal });
    addEventListener('pushstate', this.#computeMatching.bind(this), { signal: this.removedSignal });
    addEventListener('replacestate', this.#computeMatching.bind(this), {
      signal: this.removedSignal,
    });
  }

  slotChangedCallback() {
    super.slotChangedCallback();
    this.#computeMatching();
  }

  updatedCallback() {
    super.updatedCallback();
    this.scrollTo({ top: 0 });
  }

  get template(): NexwidgetTemplate {
    return html`
      ${lazyLoad(this.src(), document.createElement(this.component))}
      <slot></slot>
    `;
  }

  #computeMatching() {
    const { pathname } = location;
    const routes = <RouteWidget[]>(<unknown>this.querySelectorAll('route-widget'));

    for (const route of routes) {
      const { path, loose } = route;
      const regexPath = parse(path, loose);

      if (regexPath.pattern.test(pathname)) {
        const { component, src } = route;

        location.params = assignParams(pathname, regexPath);

        this.component = component;
        this.src = src;

        break;
      }
    }
  }
}

RouterWidget.createReactives(['src', 'component']);
RouterWidget.register('router-widget');

declare global {
  interface HTMLElementTagNameMap {
    'route-widget': RouteWidget;
  }
}

export interface RouteWidget {
  get path(): string;
  set path(v: string);

  get component(): string;
  set component(v: string);

  get loose(): boolean;
  set loose(v: boolean);

  src: () => Promise<{ default: any }>;
}

export class RouteWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: none;
        }
      `,
    ];
  }
}

RouteWidget.createAttributes([
  ['path', String],
  ['component', String],
  ['loose', Boolean],
]);

RouteWidget.register('route-widget');
