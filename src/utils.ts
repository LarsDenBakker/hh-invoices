import { TemplateResult, nothing } from 'lit-html';

export function when(condition: any, templateFn: () => TemplateResult) {
  return condition ? templateFn() : nothing;
}
