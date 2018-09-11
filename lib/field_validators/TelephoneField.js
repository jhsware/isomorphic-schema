'use strict';

const { createObjectPrototype } = require('component-registry')
const TextField = require('./TextField');
const { i18n } = require('../utils')

/*
    Email-field
*/
const ITelephoneField = require('../interfaces').ITelephoneField;

var allowedCharsRegex = /[^\d().\/+ -]+/
const TelephoneField = createObjectPrototype({
    implements: [ITelephoneField],

    extends: [TextField],
    
    constructor: function (options) {
        this._ITextField.constructor.call(this, options);
    },
    
    validate: function (inp) {
        var error = this._ITextField.validate.call(this, inp);
        if (error) { return error };
    
        // Required has been checked so if it is empty it is ok
        if (!inp) {
            return;
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
});

module.exports = TelephoneField;