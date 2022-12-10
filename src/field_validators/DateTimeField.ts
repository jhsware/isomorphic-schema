import { i18n, isNullUndefEmpty } from '../utils'
import { BaseField } from './BaseField'
import { IDateTimeField, OmitInContructor } from '../interfaces'
import { TFieldError } from '../schema';
import { parse, format } from 'date-fns'

/*
    DateTime-field
*/
type TDateTimeField = Omit<IDateTimeField, 'interfaceId' | 'providedBy'>;

export class DateTimeField extends BaseField<TDateTimeField> implements TDateTimeField {
  readonly __implements__ = [IDateTimeField];
  timezoneAware?: boolean;
  
  constructor({ required = false, readOnly = false, label = undefined, placeholder = undefined, help = undefined, timezoneAware = false }: Omit<TDateTimeField, OmitInContructor>
    = { required: false, readOnly: false, timezoneAware: false }) {
    super({ required, readOnly, label, placeholder, help });
    this.timezoneAware = timezoneAware;
  }

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    let err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (isNullUndefEmpty(inp)) {
      return;
    }

    if (inp && !(inp instanceof Date)) {
      return {
        type: 'type_error',
        i18nLabel: i18n('isomorphic-schema--date_time_field_incorrect_formatting', 'This doesn\'t look like a date with time'),
        message: "Det ser inte ut som ett riktigt datumobjekt med tid"
      }
    }

    return;
  }

  toFormattedString(inp) {
    return format(inp, 'YYYY-MM-DDTHH:mm:ssZ')
  }

  fromString(inp) {
    return parse(inp)
  }

}
