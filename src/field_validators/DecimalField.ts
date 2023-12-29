
import { BaseField } from './BaseField'
import { i18n, isNullUndefEmpty } from '../utils'

import { IBaseField, IDecimalField, OmitInContructor } from '../interfaces'
import { TFieldError } from '../schema'
import { TypeFromInterface } from 'component-registry'
/*
    Decimal-field
*/

const reDecimal = /[^0-9\.]/g


type TDecimalField = TypeFromInterface<IDecimalField>;
export class DecimalField<T = TDecimalField> extends BaseField<T> implements TDecimalField {
  readonly __implements__ = [IDecimalField, IBaseField];
  min?: number;
  max?: number;
  precision?: number;

  constructor({ required = false, readOnly = false, label = undefined, placeholder = undefined, help = undefined, min = undefined, max = undefined, precision = undefined }: Omit<TDecimalField, OmitInContructor> = {}) {
    super({ required, readOnly, label, placeholder, help });
    this.min = min;
    this.max = max;
    this.precision = precision;
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
        i18nLabel: i18n('isomorphic-schema--decimal_field_not_number', 'The field doesn\'t contain numbers'),
        message: "Värdet innehåller annat än siffror"
      };
    }

    if (typeof this.min !== 'undefined' && inp < this.min) {
      return Promise.resolve({
        type: 'constraint_error',
        i18nLabel: i18n('isomorphic-schema--decimal_field_too_small', 'The value is too small. Min ${minValue}'),
        message: "Minimum " + this.min
      })
    }

    if (typeof this.max !== 'undefined' && inp > this.max) {
      return Promise.resolve({
        type: 'constraint_error',
        i18nLabel: i18n('isomorphic-schema--decimal_field_too_big', 'The value is too big. Max ${maxValue}'),
        message: "Max " + this.max
      })
    }
  }

  toFormattedString(inp) {
    if (isNullUndefEmpty(inp)) return inp;

    let outp = inp?.toString?.() ?? inp

    // Print only nrof decimals shown in precision if set
    if (this.precision !== undefined) {
      var tmp = outp.split('.')
      outp = tmp[0]
      if (this.precision > 0) {
        outp += '.'
        if (tmp.length > 1) {
          outp += (tmp[1] + '').substring(0, this.precision)
        }
      }
    }
    return outp;
  }

  fromString(inp) {
    if (typeof inp === "string") {
      var tmp = parseFloat(inp.replace(reDecimal, ""))
    } else {
      var tmp = parseFloat(inp)
    }
    if (isNaN(tmp)) {
      return undefined
    } else {
      // Round to precision if set
      if (this.precision !== undefined) {
        var tmp = tmp * Math.pow(10, this.precision)
        var tmp = Math.round(tmp)
        var tmp = tmp / Math.pow(10, this.precision)
      }

      return tmp
    }
  }
}
