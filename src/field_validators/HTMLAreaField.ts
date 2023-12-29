import {TextAreaField} from './TextAreaField';
import striptags from 'striptags';
import { IBaseField, IHTMLAreaField, ITextField } from '../interfaces'
import { TFieldError } from '../schema';
import { TypeFromInterface } from 'component-registry';

/*
    HTML field
*/
type THTMLAreaField = TypeFromInterface<IHTMLAreaField>;

export class HTMLAreaField extends TextAreaField<THTMLAreaField> implements THTMLAreaField {
  readonly __implements__ = [IHTMLAreaField, ITextField, IBaseField];

  async validate(inp): Promise<TFieldError> {
    if (typeof inp === 'string') {
        inp = striptags(inp)
    }
    
    const error = await super.validate(inp);
    
    return error

    // TODO: should I add HTML validation? Might need cheerio, in which case 
    // perhaps only serverside validation to keep file size small in browser?
    // Could use striptags with allowed tags but it doesn't support attribute
    // stripping

  }
}

