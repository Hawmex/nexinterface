import { css } from 'nexwidget';
import { Nexinterface } from '../base/base.js';

export interface Interactive {
  get centeredRipple(): boolean;
  set centeredRipple(v: boolean);
}

export class Interactive extends Nexinterface {
  static get styles(): CSSStyleSheet[] {
    return [
      ...super.styles,
      css`
        :host {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        :host([disabled]) {
          opacity: 0.32;
          pointer-events: none;
        }

        :host(:not([disabled]))::before {
          content: '';
          background: var(--interactionEffectsColor);
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border-radius: inherit;
          opacity: var(--hoverOpacity, 0);
          transition: opacity var(--durationLvl2) var(--standardEase);
          will-change: opacity;
          pointer-events: none;
        }

        :host(:not([disabled]))::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: var(--rippleSize, 0px);
          height: var(--rippleSize, 0px);
          background: var(--interactionEffectsColor);
          opacity: var(--rippleOpacity, 0.08);
          border-radius: 50%;
          transform: var(--rippleTranslate, translate(-50%, -50%)) var(--rippleScale);
          transition: opacity var(--rippleTimer, var(--durationLvl2)) var(--standardEase),
            transform var(--rippleTimer, var(--durationLvl2)) var(--standardEase);
          will-change: opacity, transform;
          pointer-events: none;
        }
      `,
    ];
  }

  #isRippleCompleted = false;
  #isPointerActive = false;
  #timeout?: number;

  addedCallback() {
    super.addedCallback();

    this.style.setProperty('--interactionEffectsColor', this.getCSSProperty('color'));

    this.addEventListener('pointerdown', this.#startRipple, { signal: this.removedSignal });
    this.addEventListener('pointerup', this.#finishRipple, { signal: this.removedSignal });
    this.addEventListener('pointerleave', this.#finishRipple, { signal: this.removedSignal });
    this.addEventListener('touchend', this.#finishRipple, { signal: this.removedSignal });
    this.addEventListener('pointerenter', this.#startHover, { signal: this.removedSignal });
    this.addEventListener('pointerleave', this.#finishHover, { signal: this.removedSignal });
  }

  #startRipple({ clientX, clientY }: PointerEvent) {
    const { width, height, left, top } = this.getBoundingClientRect();
    const s = this.centeredRipple ? Math.max(width, height) : Math.sqrt(width ** 2 + height ** 2);
    const x = this.centeredRipple ? 0 - s / 2 : clientX - left - width / 2 - s / 2;
    const y = this.centeredRipple ? 0 - s / 2 : clientY - top - height / 2 - s / 2;

    clearTimeout(this.#timeout);

    this.#isPointerActive = true;

    this.style.setProperty('--interactionEffectsColor', this.getCSSProperty('color'));
    this.style.setProperty('--rippleTimer', '0ms');
    this.style.setProperty('--rippleSize', `${s}px`);
    this.style.setProperty('--rippleTranslate', `translate(${x}px, ${y}px)`);
    this.style.setProperty('--rippleScale', 'scale(0)');
    this.style.setProperty('--rippleOpacity', '0.08');

    requestAnimationFrame(() => {
      const timeout = Number(this.getCSSProperty('--durationLvl2').replace('ms', ''));

      this.style.setProperty('--rippleTimer', 'var(--durationLvl2)');
      this.style.setProperty('--rippleTranslate', 'translate(-50%, -50%)');
      this.style.setProperty('--rippleScale', 'scale(1.0)');

      this.#isRippleCompleted = false;

      this.#timeout = setTimeout(() => {
        if (!this.#isPointerActive) this.style.setProperty('--rippleOpacity', '0');
        this.#isRippleCompleted = true;
      }, timeout);
    });
  }

  #finishRipple() {
    if (this.#isRippleCompleted) this.style.setProperty('--rippleOpacity', '0');
    this.#isPointerActive = false;
  }

  #startHover() {
    this.style.setProperty('--interactionEffectsColor', this.getCSSProperty('color'));
    this.style.setProperty('--hoverOpacity', '0.04');
  }

  #finishHover() {
    this.style.setProperty('--hoverOpacity', '0');
  }
}

Interactive.createAttributes([['centeredRipple', Boolean]]);
