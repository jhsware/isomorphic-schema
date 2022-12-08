
/*
    Bool field
*/

import { BaseField } from './BaseField'
import { IBoolField, OmitInContructor } from '../interfaces'
import { TFieldError } from '../schema';

type TBoolField = Omit<IBoolField, 'interfaceId' | 'providedBy'>;
export class BoolField<T = TBoolField> extends BaseField<T> implements TBoolField {
    readonly __implements__ = [IBoolField];
    
    constructor({
      required = false, readOnly = false }:
      Omit<TBoolField, OmitInContructor> = {}) {
      super({ required, readOnly });
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
