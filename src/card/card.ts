import { css, html, WidgetTemplate } from 'nexwidget';
import { Nexinterface } from '../base/base.js';
import '../paper/paper.js';
import '../section/section.js';
import '../typography/typography.js';

declare global {
  interface HTMLElementTagNameMap {
    'card-widget': CardWidget;
  }
}

export interface CardWidget {
  get headline(): string | null;
  set headline(v: string | null);

  get imageSrc(): string | null;
  set imageSrc(v: string | null);
}

export class CardWidget extends Nexinterface {
  static {
    this.createAttributes([
      { key: 'imageSrc', type: 'string' },
      { key: 'headline', type: 'string' },
    ]);
    
    this.createReactives(['imageSrc', 'headline']);
    this.registerAs('card-widget');
  }

  static override get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          border-radius: 8px;
        }

        :host .header {
          display: grid;
          grid-auto-flow: row;
        }

        :host([densed]) .header {
          grid-auto-flow: column;
          grid-template-columns: 96px 1fr;
        }

        :host img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        :host([densed]) img {
          width: 96px;
        }
      `,
    ];
  }

  override get template(): WidgetTemplate {
    return html`
      <paper-widget full-width>
        <div class="header">
          <img src=${this.imageSrc ?? ''} />
          <section-widget variant="paragraphs">
            <typography-widget variant="headline">${this.headline}</typography-widget>
            <slot name="body"></slot>
          </section-widget>
        </div>
        <section-widget variant="buttons">
          <slot name="footer-leading" slot="leading"></slot>
          <slot name="footer-trailing" slot="trailing"></slot>
        </section-widget>
      </paper-widget>
    `;
  }
}
