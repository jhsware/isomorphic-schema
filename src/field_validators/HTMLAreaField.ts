/*
    Text field
*/
import { createObjectPrototype } from 'component-registry'
import TextAreaField from './TextAreaField'
const striptags = require('striptags')

import { IHTMLAreaField } from '../interfaces'

export default createObjectPrototype({
    implements: [IHTMLAreaField],
    extends: [TextAreaField],
    
    constructor: function (options) {
        this._ITextAreaField.constructor.call(this, options)
    },
    
    validate: function (inp) {
        var tmp = inp
        if (typeof inp === 'string') {
            tmp = striptags(inp)
        }
        var error = this._ITextAreaField.validate.call(this, tmp)
        
        return Promise.resolve(error)

        // TODO: should I add HTML validation? Might need cheerio, in which case 
        // perhaps only serverside validation to keep file size small in browser?
        // Could use striptags with allowed tags but it doesn't support attribute
        // stripping

    }
})
