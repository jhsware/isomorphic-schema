
import { BaseField } from '../field_validators'
import { i18n, isNullUndefEmpty } from '../utils'
import { IObjectField, OmitInContructor } from '../interfaces'
import Schema, { TFieldError, TFormErrors } from '../schema';

/*
    Object field
*/
type TObjectField = Omit<IObjectField, 'interfaceId' | 'providedBy'>;

export class ObjectField<T = TObjectField> extends BaseField<T> implements TObjectField {
  readonly __implements__ = [IObjectField];
  schema: Schema; // TODO: Should we allow passing ObjectInterface? needs schema
  objectFactoryName: string;
  
  constructor({ required = false, readOnly = false, schema, objectFactoryName = undefined }:
    Omit<TObjectField, OmitInContructor>) {
    super({ required, readOnly });
    this.schema = schema;
    this.objectFactoryName = objectFactoryName
  }

  async validate(inp, options, context): Promise<TFieldError | TFormErrors | undefined> {
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
    return formErrors; // TODO: Fix this hack
  }

  toFormattedString(inp) {
    return inp.toString();
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
