import { TextField } from './TextField'
import { IBaseField, ITextAreaField, ITextField } from '../interfaces'
import { TypeFromInterface } from 'component-registry';

/*
    Text area field
*/
type TTextAreaField = TypeFromInterface<ITextAreaField>;

export class TextAreaField<T = TTextAreaField> extends TextField<T> implements TTextAreaField {
  readonly __implements__ = [ITextAreaField, ITextField, IBaseField];
}
