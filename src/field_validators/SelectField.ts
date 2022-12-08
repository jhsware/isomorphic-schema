import { isValid } from 'date-fns';
import { i18n, isNullUndefEmpty } from '../utils'
import { BaseField } from './BaseField'
import { IBaseField, ISelectField, OmitInContructor, TSelectFieldOption } from '../interfaces'
import { TFieldError } from '../schema';

/*

    A Select Field allows you to choose a single value from a selection

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/

type TSelectField = Omit<ISelectField, 'interfaceId' | 'providedBy'>;

export class SelectField extends BaseField<TSelectField> implements TSelectField {
  readonly __implements__ = [ISelectField];
  fieldType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;
  options: TSelectFieldOption[]

  constructor({ required, readOnly, options, fieldType }: Omit<TSelectField, OmitInContructor | 'getOptionTitle'>) {
    super({ required, readOnly });
    this.options = options,
      this.fieldType = fieldType;
  }

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    let err = await super.validate(inp, options, context);
    if (err) return err;

    
    // Required has been checked so if it is empty it is ok
    if (isNullUndefEmpty(inp)) {
      return;
    }

    err = await this.fieldType.validate(inp)
    if (err) return err;

    var matches = false
    for (var i = 0; i < this.options.length; i++) {
      if (this.options[i].name === inp) {
        matches = true
        break
      }
    }

    if (!matches) {
      return {
        type: 'constraint_error',
        i18nLabel: i18n('isomorphic-schema--select_field_value_error', 'The selected value is not allowed'),
        message: "Valt värde finns inte i listan över tillåtna värden"
      }
    }

    return;
  }

  toFormattedString(inp: string) {
    return this.fieldType.fromString(inp)
  }

  fromString(inp) {
    return this.fieldType.fromString(inp)
  }

  getOptionTitle(inp) {
    for (var i = 0; i < this.options.length; i++) {
      if (this.options[i].name === inp) return this.options[i].label;
    }
  }

}
