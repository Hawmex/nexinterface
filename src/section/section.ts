import { css, html, WidgetTemplate } from 'nexwidget';
import { Nexinterface } from '../base/base.js';

export type SectionVariant = 'list' | 'inputs' | 'paragraphs' | 'buttons';

declare global {
  interface HTMLElementTagNameMap {
    'section-widget': SectionWidget;
  }
}

export interface SectionWidget {
  get variant(): SectionVariant | null;
  set variant(v: SectionVariant | null);
}

export class SectionWidget extends Nexinterface {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host([variant='list']),
        :host([variant='inputs']),
        :host([variant='paragraphs']) {
          display: flex;
          flex-direction: column;
          gap: 0px;
          padding: 8px 0px;
        }

        :host([variant='paragraphs']),
        :host([variant='inputs']) {
          padding: 16px 0px;
          gap: 8px;
        }

        :host([variant='inputs']) {
          gap: 16px;
        }

        :host([variant='buttons']) {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          padding: 8px;
        }

        :host([variant='buttons']) > div {
          align-items: center;
          display: flex;
          flex-direction: row;
          gap: 8px;
        }
      `,
    ];
  }

  get template(): WidgetTemplate {
    return html`
      ${this.variant === 'buttons'
        ? html`
            <div><slot name="leading"></slot></div>
            <div><slot name="trailing"></slot></div>
          `
        : html`<slot></slot>`}
    `;
  }
}

SectionWidget.createAttributes([{ key: 'variant', type: 'string' }]);
SectionWidget.createReactives(['variant']);
SectionWidget.registerAs('section-widget');
