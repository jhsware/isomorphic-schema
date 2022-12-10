
/*
    Ineteger-field
*/

import { BaseField } from './BaseField'
import { i18n, isNullUndefEmpty } from '../utils'

import { IIntegerField, OmitInContructor } from '../interfaces'
import { TFieldError } from '../schema'

var reInteger = /[^0-9\.]/g

type TIntegerField = Omit<IIntegerField, 'interfaceId' | 'providedBy'>;

export class IntegerField<T = TIntegerField> extends BaseField<T> implements TIntegerField {
  readonly __implements__ = [IIntegerField];
  min?: number;
  max?: number;

  constructor({ required = false, readOnly = false, label = undefined, placeholder = undefined, help = undefined, min = undefined, max = undefined }: Omit<TIntegerField, OmitInContructor> = {}) {
    super({ required, readOnly, label, placeholder, help });
    this.min = min;
    this.max = max;
  }

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    const err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (isNullUndefEmpty(inp)) {
      return;
    }

    if (typeof inp !== "number" || isNaN(inp)) {
      return {
        type: 'type_error',
        i18nLabel: i18n('isomorphic-schema--integer_field_not_number', 'The field doesn\'t contain numbers'),
        message: "Värdet innehåller annat än siffror"
      }
    }

    if (parseInt(inp.toString()) !== inp) {
      return {
        type: 'type_error',
        i18nLabel: i18n('isomorphic-schema--integer_field_no_decimals', 'The field may not contain decimals'),
        message: "Värdet får inte innehålla en decimaldel"
      }
    }

    if (this.min !== undefined && inp < this.min) {
      return {
        type: 'constraint_error',
        i18nLabel: i18n('isomorphic-schema--integer_field_too_small', 'The value is too small. Min ${minValue}'),
        message: "Minimum " + this.min
      }
    }

    if (this.max !== undefined && inp > this.max) {
      return {
        type: 'constraint_error',
        i18nLabel: i18n('isomorphic-schema--integer_field_too_big', 'The value is too big. Max ${maxValue}'),
        message: "Max " + this.max
      }
    }

  }

  toFormattedString(inp) {
    return isNullUndefEmpty(inp) ? '' : inp.toString();
  }

  fromString(inp) {
    const tmp = typeof inp === "string"
      ? parseInt(inp.replace(reInteger, ""))
      : parseInt(inp);

    return isNaN(tmp) ? undefined : tmp;
  }
}
