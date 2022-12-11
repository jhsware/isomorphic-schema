import { TextField } from './TextField'
import { IBaseField, ITelephoneField, ITextField } from '../interfaces'
import { TFieldError } from '../schema'
import { i18n } from '../utils'

/*
    Telephone-field
*/

var allowedCharsRegex = /[^\d().\/+ -]+/
type TTelephoneField = Omit<ITelephoneField, 'interfaceId' | 'providedBy'>;

export class TelephoneField extends TextField<TTelephoneField> implements TTelephoneField {
  readonly __implements__ = [ITelephoneField, ITextField, IBaseField];

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    const err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (!inp) {
      return;
    }

    var tmpInp = inp.replace(/[^\d]/, '')
    if (tmpInp.length > 15) {
      return {
        type: 'value_error',
        i18nLabel: i18n('isomorphic-schema--telephone_field_too_long', 'This is not a valid telephone number, max 15 numericals'),
        message: "This is not a valid telephone number, max 15 numericals"
      }
    }

    if (allowedCharsRegex.test(inp)) {
      return {
        type: 'value_error',
        i18nLabel: i18n('isomorphic-schema--telephone_field_invalid_chars', 'Invalid telephone number, you may only use numbers and common delimiters'),
        message: "Invalid telephone number, you may only use numbers and common delimiters"
      }
    }

    return;
  }
}
