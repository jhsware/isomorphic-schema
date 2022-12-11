import { TextField } from './TextField'
import { IBaseField, ITextAreaField, ITextField } from '../interfaces'

/*
    Text area field
*/
type TTextAreaField = Omit<ITextAreaField, 'interfaceId' | 'providedBy'>;

export class TextAreaField<T = TTextAreaField> extends TextField<T> implements TTextAreaField {
  readonly __implements__ = [ITextAreaField, ITextField, IBaseField];
}
