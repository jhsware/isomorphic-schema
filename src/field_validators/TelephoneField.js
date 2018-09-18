'use strict'

import { createObjectPrototype } from 'component-registry'
import TextField from './TextField'
import { i18n } from '../utils'

/*
    Email-field
*/
import { ITelephoneField } from '../interfaces'

var allowedCharsRegex = /[^\d().\/+ -]+/
export default createObjectPrototype({
    implements: [ITelephoneField],

    extends: [TextField],
    
    constructor: function (options) {
        this._ITextField.constructor.call(this, options)
    },
    
    validate: function (inp) {
        var error = this._ITextField.validate.call(this, inp)
        if (error) { return error }
    
        // Required has been checked so if it is empty it is ok
        if (!inp) {
            return
        }
    
        var tmpInp = inp.replace(/[^\d]/, '')
        if(tmpInp.length > 15) {
            return {
                type: 'value_error',
                i18nLabel: i18n('isomorphic-schema--telephone_field_too_long', 'This is not a valid telephone number, max 15 numericals'),
                message: "This is not a valid telephone number, max 15 numericals"
            }
        }

        if (allowedCharsRegex.test(inp)) {
            return {
                type: 'value_error',
                i18nLabel: i18n('isomorphic-schema--telephone_field_invalid_chars', 'Invalid telephone number, you may only use numbers and common delimiters'),
                message: "Invalid telephone number, you may only use numbers and common delimiters"
            }

        }
    }
})
