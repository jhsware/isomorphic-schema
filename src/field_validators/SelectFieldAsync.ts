import { i18n, isNullUndefEmpty } from '../utils'
import { BaseField } from './BaseField'
import { IBaseField, ISelectFieldAsync, OmitInContructor, TSelectFieldOption } from '../interfaces'
import { TFieldError } from '../schema';

/*

    A Select Field Async allows you to choose a single value from a selection where
    options are dynamically fetched

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/

type TSelectFieldAsync = Omit<ISelectFieldAsync, 'interfaceId' | 'providedBy'>;

export class SelectFieldAsync extends BaseField<TSelectFieldAsync> implements TSelectFieldAsync {
  readonly __implements__ = [ISelectFieldAsync];
  valueType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;
  _getOptions;


  constructor({ required, readOnly, getOptions, valueType }: Omit<TSelectFieldAsync, OmitInContructor | 'getOptionLabel'>) {
    super({ required, readOnly });
    this._getOptions = getOptions;
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

    const _options = await this._getOptions();

    var matches = false
    for (var i = 0; i < _options.length; i++) {
      if (_options[i].name === inp) {
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
    return this.valueType.fromString(inp)
  }

  fromString(inp) {
    return this.valueType.fromString(inp)
  }

  async getOptions(): Promise<TSelectFieldOption[]> {
    return this._getOptions();
  }

  async getOptionLabel(name: string): Promise<string> {
    const options = await this._getOptions();
    for (var i = 0; i < options.length; i++) {
      if (options[i].name === name) return options[i].label;
    }
  }

}
