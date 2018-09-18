'use strict'
import { createObjectPrototype } from 'component-registry'
const isValid = require('date-fns/is_valid')
import TextField from './TextField'
import { i18n } from '../utils'

/*
    Date-field
*/
import { IDateField } from '../interfaces'

export default createObjectPrototype({
    implements: [IDateField],

    extends: [TextField],
    
    constructor: function (options) {
        this._ITextField.constructor.call(this, options)
    },
    
    validate: function (inp) {
        var error = this._ITextField.validate.call(this, inp);
        if (error) { return error }
    
        if(inp && (inp.length != 10 || !isValid(new Date(inp)))) {
            error = {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--date_field_incorrect_formatting', 'This doesn\'t look like a date'),
                message: "Det ser inte ut som datum"
            }
        
            return error
        }
    
    },

    toFormattedString: function (inp) {
        return inp
    },

    fromString: function (inp) {
        return inp
    }
})
