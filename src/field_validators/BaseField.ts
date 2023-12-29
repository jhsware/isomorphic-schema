
/*
    Standard options:

    required: false

*/

import { ObjectPrototype, TypeFromInterface } from 'component-registry'

import { IBaseField, OmitInContructor } from '../interfaces'
import { TFieldError, TValidationOptions } from '../schema';
import { i18n, isNullUndefEmpty } from '../utils'

type TBaseField = TypeFromInterface<IBaseField>;
export class BaseField<T = TBaseField> extends ObjectPrototype<Omit<T, OmitInContructor>> implements TBaseField {
  readonly __implements__ = [IBaseField];
  required: boolean;
  readOnly: boolean;
  label?: string;
  placeholder?: string;
  help?: string;


  constructor({ required = false, readOnly = false, label = undefined, placeholder = undefined, help = undefined }: Omit<TBaseField, OmitInContructor> = {}) {
    super();
    this.required = required;
    this.readOnly = readOnly;
    this.label = label;
    this.placeholder = placeholder;
    this.help = help;
  }

  async validate(
    inp: any,
    options: TValidationOptions = {
      skipInvariants: false, selectFields: [], omitFields: [], objectPath: []
    },
    context: any = undefined): Promise<TFieldError | undefined> {
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
    return inp?.toString?.();
  }

  fromString(inp, options) {
    return inp;
  }
}
