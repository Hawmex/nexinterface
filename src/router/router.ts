import { css, html, nothing, WidgetTemplate } from 'nexwidget';
import { lazyLoad } from 'nexwidget/dist/directives/lazyload.js';
import { parse } from 'regexparam';
import { Nexinterface } from '../base/base.js';
import { Screen } from '../screen/screen.js';

type LocationParams = { [key: string]: unknown };

export type RouteSrc = () => Promise<{ [key: string]: Screen }>;

const assignParams = (path: string, { keys, pattern }: { keys: string[]; pattern: RegExp }) => {
  let i = 0;
  const out: LocationParams = {};
  const matches = pattern.exec(path);

  while (i < keys.length) out[keys[i]] = Array.isArray(matches) ? matches[++i] : null;

  return out;
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
  get src(): RouteSrc | undefined;
  set src(v: RouteSrc | undefined);

  get component(): string | null | undefined;
  set component(v: string | null | undefined);

  get loose(): boolean;
  set loose(v: boolean);
}

export class RouterWidget extends Nexinterface {
  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          overflow-y: auto;
          scroll-behavior: smooth;
        }
      `,
    ];
  }

  override addedCallback() {
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

  override slotChangedCallback() {
    super.slotChangedCallback();
    this.#computeMatching();
  }

  override updatedCallback() {
    super.updatedCallback();
    this.scrollTo({ top: 0 });
  }

  override get template(): WidgetTemplate {
    return html`
      ${this.src && this.component
        ? lazyLoad(this.src(), document.createElement(this.component))
        : nothing}
      <slot></slot>
    `;
  }

  #computeMatching() {
    const { pathname } = location;
    const routes = <RouteWidget[]>(<unknown>this.querySelectorAll('route-widget'));

    for (const route of routes) {
      const { path, loose } = route;
      const regexPath = parse(path!, loose);

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
RouterWidget.registerAs('router-widget');

declare global {
  interface HTMLElementTagNameMap {
    'route-widget': RouteWidget;
  }
}

export interface RouteWidget {
  get path(): string | null;
  set path(v: string | null);

  get component(): string | null;
  set component(v: string | null);

  get loose(): boolean;
  set loose(v: boolean);

  src: RouteSrc | undefined;
}

export class RouteWidget extends Nexinterface {
  static override get styles(): CSSStyleSheet[] {
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
  { key: 'path', type: 'string' },
  { key: 'component', type: 'string' },
  { key: 'loose', type: 'boolean' },
]);

RouteWidget.registerAs('route-widget');
