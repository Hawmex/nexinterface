import { css } from 'nexwidget';
import { Nexinterface } from '../base/base.js';
import { Nexscreen } from '../screen/screen.js';

export type RouteSrc = () => Promise<{ [key: string]: Nexscreen }>;

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
  static {
    this.createAttributes([
      { key: 'path', type: 'string' },
      { key: 'component', type: 'string' },
      { key: 'loose', type: 'boolean' },
    ]);
    
    this.registerAs('route-widget');
  }

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
