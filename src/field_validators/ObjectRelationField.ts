import { BaseField } from './BaseField'
import { i18n, isNullUndefEmpty } from '../utils'

import { IObjectRelationField, OmitInContructor } from '../interfaces'
import { TFieldError } from '../schema';
import { resolve } from 'path';

/*
    Object field
*/

type TObjectRelationField = Omit<IObjectRelationField, 'interfaceId' | 'providedBy'>;

export class ObjectRelationField<T = TObjectRelationField> extends BaseField<T> implements TObjectRelationField {
  readonly __implements__ = [IObjectRelationField];

  constructor({ required = false, readOnly = false, label = undefined, placeholder = undefined, help = undefined }:
    Omit<TObjectRelationField, OmitInContructor>) {
    super({ required, readOnly, label, placeholder, help });
  }

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    const err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (isNullUndefEmpty(inp)) {
      return;
    }
        // We need to resolve the relation to validate it
        const val = inp.get?.()
        /*
        // TODO: Implement object type validation
        // TODO: Consider implementing test on server for existence of related object
        // Validate data and return an error object
        if (val) {
            if (this._inte && this._objectType !== val._type) {
                
                // The related object doesn't implement any of the accepted interfaces
                return {
                    type: "relation_error",
                    message: "Relaterat objekt är av fel typ, ska vara: " + this._objectType
                }
            }            
        } else {
            return undefined
        }
        */
        return undefined
  }

  toFormattedString(inp) {
    return inp;
  }

  fromString(inp) {
    return inp;
  }
}
