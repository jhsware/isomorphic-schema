'use strict'
import Schema from './schema'
import { i18n, renderString } from './utils'
import {
  IBaseField,
  ITextField,
  ITextAreaField,
  IIntegerField,
  IDecimalField,
  IBoolField,
  ICreditCardField,
  IDateField,
  IDateTimeField,
  IEmailField,
  ITelephoneField,
  IListField,
  IObjectField,
  IObjectRelationField,
  IOrgNrField,
  IPasswordField,
  ISelectField,
  IDynamicSelectBaseField,
  IDynamicSelectAsyncBaseField,
  IMultiSelectField,
  IDynamicMultiSelectField,
  IHTMLAreaField,
  IAnyOf
} from './interfaces'

import {
  AnyOf,
  BaseField,
  BoolField,
  CreditCardField,
  DateField,
  DateTimeField,
  DecimalField,
  DynamicSelectAsyncBaseField,
  DynamicSelectBaseField,
  EmailField,
  HTMLAreaField,
  IntegerField,
  ListField,
  MultiSelectField,
  ObjectField,
  ObjectRelationField,
  OrgNrField,
  PasswordField,
  SelectField,
  TelephoneField,
  TextAreaField,
  TextField
} from './field_validators'

const interfaces = {
  IBaseField,
  ITextField,
  ITextAreaField,
  IIntegerField,
  IDecimalField,
  IBoolField,
  ICreditCardField,
  IDateField,
  IDateTimeField,
  IEmailField,
  ITelephoneField,
  IListField,
  IObjectField,
  IObjectRelationField,
  IOrgNrField,
  IPasswordField,
  ISelectField,
  IDynamicSelectBaseField,
  IDynamicSelectAsyncBaseField,
  IMultiSelectField,
  IDynamicMultiSelectField,
  IHTMLAreaField,
  IAnyOf
}

const fieldValidators = {
  AnyOf,
  BaseField,
  BoolField,
  CreditCardField,
  DateField,
  DateTimeField,
  DecimalField,
  DynamicSelectAsyncBaseField,
  DynamicSelectBaseField,
  EmailField,
  HTMLAreaField,
  IntegerField,
  ListField,
  MultiSelectField,
  ObjectField,
  ObjectRelationField,
  OrgNrField,
  PasswordField,
  SelectField,
  TelephoneField,
  TextAreaField,
  TextField
}

export {
  Schema,
  interfaces,
  i18n,
  renderString,
  fieldValidators
}
