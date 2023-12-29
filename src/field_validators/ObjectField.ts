import { BaseField } from '../field_validators'
import { i18n, isNullUndefEmpty } from '../utils'
import { IBaseField, IObjectField, OmitInContructor } from '../interfaces'
import { Schema, TFieldError, TFormErrors } from '../schema';
import { TypeFromInterface } from 'component-registry';

/*
    Object field
*/
type TObjectField = TypeFromInterface<IObjectField>;

export class ObjectField<T = TObjectField> extends BaseField<T> implements TObjectField {
  readonly __implements__ = [IObjectField, IBaseField];
  schema: Schema; // TODO: Should we allow passing ObjectInterface? needs schema
  objectFactoryName: string;
  
  constructor({ required = false, readOnly = false, label = undefined, placeholder = undefined, help = undefined, schema, objectFactoryName = undefined }:
    Omit<TObjectField, OmitInContructor>) {
    super({ required, readOnly, label, placeholder, help });
    this.schema = schema;
    this.objectFactoryName = objectFactoryName
  }

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    const err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (isNullUndefEmpty(inp)) {
      return;
    }

    const schema = this.schema;

    // Allow object fields without schema (useful for modelling objects that we don't know what they look like)
    if (schema === undefined) {
      return undefined;
    }

    const formErrors = await schema.validate(inp, options, context);
    
    if (formErrors?.fieldErrors || formErrors?.invariantErrors ) {
      return {
        type: 'object_error',
        i18nLabel: i18n('isomorphic-schema--list_field_value_error', 'There is an error in object'),
        message: 'There is an error in object',
        errors: formErrors.fieldErrors
      }; // TODO: Fix this hack
    }

    return;
  }

  toFormattedString(inp) {
    return inp?.toString?.();
  }

  fromString(inp, options) {
    const schema = this.schema;

    if (typeof inp === 'object' && schema !== undefined) {
        return schema.transform(inp, options); // TODO: Do we need to pass options?
    } else {
        return inp
    }
  }
}
