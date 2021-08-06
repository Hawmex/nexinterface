import { css, html, Nexwidget, NexwidgetTemplate } from 'nexwidget';
import '../paper/paper.js';
import '../section/section.js';
import '../typography/typography.js';

declare global {
  interface HTMLElementTagNameMap {
    'card-widget': CardWidget;
  }
}

export interface CardWidget {
  get headline(): string;
  set headline(v: string);

  get imageSrc(): string;
  set imageSrc(v: string);
}

export class CardWidget extends Nexwidget {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          border-radius: 8px;
          overflow: hidden;
        }

        :host([densed]) .header {
          display: grid;
          grid-template-columns: 96px 1fr;
        }

        :host img {
          width: 96px;
          height: 100%;
          object-fit: cover;
        }
      `,
    ];
  }

  get template(): NexwidgetTemplate {
    return html`
      <paper-widget full-width>
        <div class="header">
          <img src=${this.imageSrc} />
          <section-widget variant="paragraphs">
            <typography-widget variant="headline">${this.headline}</typography-widget>
            <slot name="body"></slot>
          </section-widget>
        </div>
        <section-widget variant="buttons">
          <slot name="icons" slot="icons"></slot>
          <slot name="buttons" slot="buttons"></slot>
        </section-widget>
      </paper-widget>
    `;
  }
}

CardWidget.createAttributes([
  ['imageSrc', String],
  ['headline', String],
]);

CardWidget.createReactives(['imageSrc', 'headline']);
CardWidget.register('card-widget');
