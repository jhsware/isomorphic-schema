import { TextField } from './TextField'
import { ITextAreaField } from '../interfaces'

/*
    Text area field
*/
type TTextAreaField = Omit<ITextAreaField, 'interfaceId' | 'providedBy'>;

export class TextAreaField<T = TTextAreaField> extends TextField<T> implements TTextAreaField {
  readonly __implements__ = [ITextAreaField];
}
