import { isValid } from 'date-fns';
import { i18n, isNullUndefEmpty } from '../utils'
import { BaseField } from './BaseField'
import { IBaseField, IDateField, OmitInContructor } from '../interfaces'
import { TFieldError } from '../schema';
import { TypeFromInterface } from 'component-registry';

/*
    Date-field
*/
type TDateField = TypeFromInterface<IDateField>;

export class DateField extends BaseField<TDateField> implements TDateField {
  readonly __implements__ = [IDateField, IBaseField];
  constructor({
    required = false, readOnly = false, label = undefined, placeholder = undefined, help = undefined }: Omit<TDateField, OmitInContructor>) {
    super({ required, readOnly, label, placeholder, help });
  }

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    let err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (isNullUndefEmpty(inp)) {
      return;
    }

    if (inp && (inp.length != 10 || !isValid(new Date(inp)))) {
      return {
        type: 'type_error',
        i18nLabel: i18n('isomorphic-schema--date_field_incorrect_formatting', "This doesn't look like a date"),
        message: "This doesn't look like a date"
      }
    }

    return;
  }

}
