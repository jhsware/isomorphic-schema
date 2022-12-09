import { BaseField } from './BaseField'
import { i18n, isNullUndefEmpty } from '../utils'

import { IAnyOf, OmitInContructor } from '../interfaces'
import { TFieldError } from '../schema';

/*
    Standard options:

    required: false

*/

type TAnyOf = Omit<IAnyOf, 'interfaceId' | 'providedBy'>;

export class AnyOf<T = TAnyOf> extends BaseField<T> implements TAnyOf {
  readonly __implements__ = [IAnyOf];
  valueTypes;

  constructor({ required = false, readOnly = false, valueTypes }:
    Omit<TAnyOf, OmitInContructor>) {
    super({ required, readOnly });
    this.valueTypes = valueTypes;
  }

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    const err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (isNullUndefEmpty(inp)) {
      return;
    }

    const errorPromises = this.valueTypes.map(function (field) {
      // Convert value so it can be checked properly, but if it converts to empty or undefined use original value
      var tmp = field.fromString(inp)
      return field.validate(tmp || inp, options, context)
    })

    const fieldErrors = await Promise.all(errorPromises)
    const error = fieldErrors.reduce((prev, curr) => {
      // If one of the validators pass we are ok
      if (curr === undefined) {
        return false
      } else {
        return prev
      }
    }, true)

    if (error) {
      return {
        type: 'constraint_error',
        i18nLabel: i18n('isomorphic-schema--any_of_error', 'The entered value doesn\'t match any of the allowed value types'),
        message: 'Inmatat värde matchar inte de tillåtna alternativen'
      }
    }
  }

  toFormattedString(inp) {
    return inp;
  }

  fromString(inp) {
    return inp;
  }
}
