import {TextAreaField} from './TextAreaField';
import striptags from 'striptags';
import { IHTMLAreaField } from '../interfaces'

/*
    HTML field
*/
type THTMLAreaField = Omit<IHTMLAreaField, 'interfaceId' | 'providedBy'>;

export class HTMLAreaField extends TextAreaField<THTMLAreaField> implements THTMLAreaField {
  readonly __implements__ = [IHTMLAreaField];

  async validate(inp) {
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

