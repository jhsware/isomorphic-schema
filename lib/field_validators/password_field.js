'use strict';

var TextField = require('./base_fields').TextField;

/*
    Email-field
*/
var PasswordField = function (options) {
    this._isSubTypeOf = new TextField(options);
    this._isRequired = options && options.required;
}

PasswordField.prototype.type = 'PasswordField';

PasswordField.prototype.validate = function (inp) {
    var error = this._isSubTypeOf.validate(inp);
    if (error) { return error };
    
    if(inp.length < 8) {
        error = {
            type: 'constraint_error',
            message: "Lösenordet måste innehålla minst 8 tecken"
        }
        
        return error;
    }
    
}

PasswordField.prototype.toFormattedString = function (inp) {
    return inp;
}

PasswordField.prototype.fromString = function (inp) {
    return inp;
}

module.exports = PasswordField;