import { TextField } from './TextField'
import { IPasswordField } from '../interfaces'

/*
Password-field
*/
type TPasswordField = Omit<IPasswordField, 'interfaceId' | 'providedBy'>;

export class PasswordField extends TextField<TPasswordField> implements TPasswordField {
  readonly __implements__ = [IPasswordField];
}
