'use strict';

var TextField = require('./base_fields').TextField;
var moment = require('moment');

/*
    Date-field
*/
var DateField = function (options) {
    this._isSubTypeOf = new TextField(options);
    this._isRequired = options && options.required;
}

DateField.prototype.type = 'DateField';

DateField.prototype.validate = function (inp) {
    var error = this._isSubTypeOf.validate(inp);
    if (error) { return error };
    
    if(inp && (inp.length != 10 || !moment(inp).isValid())) {
        error = {
            type: 'type_error',
            message: "Det ser inte ut som datum"
        }
        
        return error;
    }
    
}

DateField.prototype.toFormattedString = function (inp) {
    return inp;
}

DateField.prototype.fromString = function (inp) {
    return inp;
}

module.exports = DateField;