
/*
    Standard options:

    required: false

*/

import { ObjectPrototype } from 'component-registry'

import { IBaseField, OmitInContructor } from '../interfaces'
import { TFieldError } from '../schema';
import { i18n, isNullUndefEmpty } from '../utils'

type TBaseField = Omit<IBaseField, 'interfaceId' | 'providedBy'>;
export class BaseField<T = TBaseField> extends ObjectPrototype<Omit<T, OmitInContructor>> implements TBaseField {
  readonly __implements__ = [IBaseField];
  required: boolean;
  readOnly: boolean;
  constructor({ required = false, readOnly = false }: Omit<TBaseField, OmitInContructor> = {}) {
    super();
    this.required = required;
    this.readOnly = readOnly;
  }

  async validate(inp, options, context): Promise<TFieldError> {
    context = context || inp;
    if (this.required && isNullUndefEmpty(inp)) {
      return {
        type: 'required',
        i18nLabel: i18n('isomorphic-schema--field_required', 'Required'),
        message: "Obligatoriskt"
      };
    }
  }

  toFormattedString(inp) {
    return inp.toString();
  }

  fromString(inp) {
    return inp;
  }
}
