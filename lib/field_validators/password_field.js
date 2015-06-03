'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var TextField = require('./base_fields').TextField;

/*
    Password-field
*/
var IPasswordField = require('../interfaces').IPasswordField;

var PasswordField = createObjectPrototype({
    implements: [IPasswordField],

    extends: [TextField],
    
    constructor: function (options) {
        this._ITextField.constructor.call(this, options);
    },
    
    validate: function (inp) {
        var error = this._ITextField.validate.call(this, inp);
        if (error) { return error };
    
        if(inp.length < 8) {
            error = {
                type: 'constraint_error',
                message: "Lösenordet måste innehålla minst 8 tecken"
            }
        
            return error;
        }
    
    },
    
    toFormattedString: function (inp) {
        return inp;
    },
    
    fromString: function (inp) {
        return inp;
    }
});

module.exports = PasswordField;