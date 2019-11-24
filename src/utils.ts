import { TemplateResult, nothing } from 'lit-html';

export function when(condition: any, templateFn: () => TemplateResult) {
  return condition ? templateFn() : nothing;
}

// EventTarget is not extendable on al browsers
export class EventTargetShim {
  private __delegateEventTarget = document.createDocumentFragment();

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ) {
    this.__delegateEventTarget.addEventListener(type, listener, options);
  }

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ) {
    this.__delegateEventTarget.removeEventListener(type, callback, options);
  }

  dispatchEvent(event: Event) {
    this.__delegateEventTarget.dispatchEvent(event);
  }
}
