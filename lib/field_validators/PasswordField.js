'use strict';

const { createObjectPrototype } = require('component-registry')
const TextField = require('./TextField');
const { i18n } = require('../utils')

/*
    Password-field
*/
const IPasswordField = require('../interfaces').IPasswordField;

const PasswordField = createObjectPrototype({
    implements: [IPasswordField],

    extends: [TextField],
    
    constructor: function (options) {
        this._ITextField.constructor.call(this, options);
    },
    
    validate: function (inp) {
        var error = this._ITextField.validate.call(this, inp);
        if (error) { return error };
    
        if(inp !== null && typeof inp !== 'undefined' && inp.length < 8) {
            error = {
                type: 'constraint_error',
                i18nLabel: i18n('isomorphic-schema--password_field_too_short', 'The password must contain at least 8 chars'),
                message: "Lösenordet måste innehålla minst 8 tecken"
            }
        
            return error;
        }
    
    }
});

module.exports = PasswordField;