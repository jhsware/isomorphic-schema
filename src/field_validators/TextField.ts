
/*
    Text field
*/
import { BaseField } from './BaseField'
import { i18n, isNullUndefEmpty } from '../utils'

import { ITextField, OmitInContructor } from '../interfaces'
import { TFieldError } from '../schema';

type TTextField = Omit<ITextField, 'interfaceId' | 'providedBy'>;

export class TextField<T = TTextField> extends BaseField<T> implements TTextField {
  readonly __implements__ = [ITextField];
  
  minLength: number;
  maxLength: number;
  trim: boolean;
  constructor({
    required = false, readOnly = false, label = undefined, placeholder = undefined, help = undefined, minLength = undefined, maxLength = undefined, trim = false }:
    Omit<TTextField, OmitInContructor> = {}) {
    super({ required, readOnly, label, placeholder, help });
    this.minLength = minLength;
    this.maxLength = maxLength;
    this.trim = trim;
  }

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    // First trim so we can se if it is empty
    if (this.trim) {
      inp = inp?.trim?.()
    }

    const err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (isNullUndefEmpty(inp)) {
      return;
    }

    // TODO: Check for line breaks
    if (typeof inp !== "string") {
      return {
        type: 'type_error',
        i18nLabel: i18n('isomorphic-schema--text_field_no_string', 'The field doesn\'t contain text'),
        message: "Fältet är inte en sträng"
      };
    } else if (this.minLength && inp.length < this.minLength) {
      return {
        type: 'type_error',
        i18nLabel: i18n('isomorphic-schema--text_field_too_short', 'The text is too short. Min ${minLength} chars.'),
        message: "Texten är för kort. Minst " + this.minLength + " tkn"
      };
    } else if (this.maxLength && inp.length > this.maxLength) {
      return {
        type: 'type_error',
        i18nLabel: i18n('isomorphic-schema--text_field_too_long', 'The text is too long. Max ${maxLength} chars.'),
        message: "Texten är för lång. Max " + this.maxLength + " tkn"
      };
    }
  }

  toFormattedString(inp) {
    return inp.toString();
  }

  fromString(inp) {
    if (this.trim) {
      return inp.trim?.();
    } else {
      return inp;
    }
  }
}
