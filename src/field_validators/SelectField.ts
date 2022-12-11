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
  readonly __implements__ = [ISelectField, IBaseField];
  options: TSelectFieldOption[]
  valueType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;

  constructor(
    { required = false, readOnly = false, options = undefined, valueType, label = undefined, placeholder = undefined, help = undefined }: Omit<TSelectField, OmitInContructor | 'getOptionLabel'>) {
    super({ required, readOnly, label, placeholder, help });
    this.options = options,
    this.valueType = valueType;
  }

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    let err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (isNullUndefEmpty(inp)) {
      return;
    }

    err = await this.valueType.validate(inp)
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

  toFormattedString(inp) {
    return this.valueType.fromString(inp)
  }

  fromString(inp) {
    return this.valueType.fromString(inp)
  }

  getOptionLabel(inp) {
    for (var i = 0; i < this.options.length; i++) {
      if (this.options[i].name === inp) return this.options[i].label
    }
  }

}
