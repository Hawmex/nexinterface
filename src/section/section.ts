import { css, html, WidgetTemplate } from 'nexwidget/nexwidget.js';
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
  static {
    this.createAttributes([{ key: 'variant', type: 'string' }]);
    this.createReactives(['variant']);
    this.registerAs('section-widget');
  }

  static override get styles(): CSSStyleSheet[] {
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
          flex-wrap: wrap;
          gap: 8px;
          padding: 8px;
        }

        :host([variant='buttons']) > div {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        :host([variant='buttons']) .end {
          margin-inline-start: auto;
          justify-content: flex-end;
        }
      `,
    ];
  }

  override get template(): WidgetTemplate {
    return html`
      ${this.variant === 'buttons'
        ? html`
            <div><slot name="leading"></slot></div>
            <div class="end"><slot name="trailing"></slot></div>
          `
        : html`<slot></slot>`}
    `;
  }
}
