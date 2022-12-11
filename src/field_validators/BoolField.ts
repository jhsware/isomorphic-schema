
/*
    Bool field
*/

import { BaseField } from './BaseField'
import { IBaseField, IBoolField, OmitInContructor } from '../interfaces'
import { TFieldError } from '../schema';

type TBoolField = Omit<IBoolField, 'interfaceId' | 'providedBy'>;
export class BoolField<T = TBoolField> extends BaseField<T> implements TBoolField {
    readonly __implements__ = [IBoolField, IBaseField];
    
    constructor({
      required = false, readOnly = false, label = undefined, placeholder = undefined, help = undefined }:
      Omit<TBoolField, OmitInContructor> = {}) {
      super({ required, readOnly, label, placeholder, help });
    }

    async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
        // False and undefined == false so this is always ok
        return;
    }

    toFormattedString(inp) {
        return inp
    }
    
    fromString(inp) {
        if (inp == "true" || inp === true) {
            return true
        } else if (inp == "false" || inp === false) {
            return false
        } else if (inp === "undefined" || inp === undefined ){
            return undefined
        } else if (inp === 'null' || inp === null) {
            return null
        }
        
        return inp;
    }
}
