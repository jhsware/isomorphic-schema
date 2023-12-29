
import { i18n, isNullUndefEmpty } from '../utils'
import { BaseField } from './BaseField'
import { IBaseField, IMultiSelectField, OmitInContructor, TSelectFieldOption } from '../interfaces'
import { TFieldError } from '../schema';
import { TypeFromInterface } from 'component-registry';

/*

    A Select Field allows you to choose a single value from a selection

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/


type TMultiSelectField = TypeFromInterface<IMultiSelectField>;

export class MultiSelectField extends BaseField<TMultiSelectField> implements TMultiSelectField {
  readonly __implements__ = [IMultiSelectField, IBaseField];
  options: TSelectFieldOption[]
  valueType: TypeFromInterface<IBaseField>;

  constructor(
    { required = false, readOnly = false, options = undefined, valueType, label = undefined, placeholder = undefined, help = undefined }: Omit<TMultiSelectField, OmitInContructor | 'getOptionLabel'>) {
    super({ required, readOnly, label, placeholder, help });
    this.options = options,
      this.valueType = valueType;
  }

  async validate(inp: string[], options = undefined, context = undefined): Promise<TFieldError | undefined> {
    let err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (isNullUndefEmpty(inp)) {
      return;
    }

    // Check every value in list
    var matches = true;
    for (const val of inp) {
      // Only check until anything is wrong
      if (!matches) break;

      // Check value type
      err = await this.valueType.validate(val)
      if (err) return err;

      for (const option of this.options) {
        if (option.name === val) {
          break
        }
        // Nothing matched so this
        matches = false;
      }

    }

    if (!matches) {
      return {
        type: 'constraint_error',
        i18nLabel: i18n('isomorphic-schema--multi_select_field_value_error', 'One or more of the selected values is not allowed'),
        message: "Ett eller flera valda värden finns inte i listan över tillåtna värden"
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
    for (const option of this.options) {
      if (option.name === inp) return option.label
    }
  }

}
