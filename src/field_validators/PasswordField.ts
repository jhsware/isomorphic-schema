import { TextField } from './TextField'
import { IBaseField, IPasswordField, ITextField } from '../interfaces'
import { TypeFromInterface } from 'component-registry';

/*
Password-field
*/
type TPasswordField = TypeFromInterface<IPasswordField>;

export class PasswordField extends TextField<TPasswordField> implements TPasswordField {
  readonly __implements__ = [IPasswordField, ITextField, IBaseField];
}
