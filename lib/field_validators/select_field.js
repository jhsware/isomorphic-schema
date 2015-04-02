'use strict';

var BaseField = require('./base_fields').BaseField;

/*

    A Select Field allows you to choose a single value from a selection

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/
var SelectField = function (options) {
    this._isSubTypeOf = new BaseField(options);
    this._isRequired = options && options.required;
    this.valueType = new options.valueType();
    this.options = options.options;
}

SelectField.prototype.type = 'SelectField';

SelectField.prototype.validate = function (inp) {
    var error = this._isSubTypeOf.validate(inp);
    if (error) { return error };
    
    var error = this.valueType.validate(inp);
    if (error) { return error };
    
    //console.log("[Select] options:");
    //console.log(this.options);
    
    //console.log("[Select] current:");
    //console.log(inp);
    
    var matches = this.options.filter(function (option) {
        return option.name === inp;
    })
    
    if (matches.length < 1) {
        error = {
            type: 'constraint_error',
            message: "Valt värde finns inte i listan över tillåtna värden"
        }
        //console.log(error);
        return error;
    }
}

SelectField.prototype.toFormattedString = function (inp) {
    return this.valueType.fromString(inp);
}

SelectField.prototype.fromString = function (inp) {
    return this.valueType.fromString(inp);
}

module.exports = SelectField;