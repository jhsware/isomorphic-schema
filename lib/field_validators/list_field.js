'use strict';

var BaseField = require('./base_fields').BaseField;

/*

    A Select Field allows you to choose a single value from a selection

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/

// TODO: Write tests
var ListField = function (options) {
    this._isSubTypeOf = new BaseField(options);
    this._isRequired = options && options.required;
    this.valueType = new options.valueType({
        required: options.required
    }); // Passing required to value type to get validation per item
    this.options = options.options;
}

ListField.prototype.type = 'ListField';

ListField.prototype.validate = function (inp) {
    if (inp.length == 0) { inp = undefined };
    var error = this._isSubTypeOf.validate(inp);
    if (error) { return error };
    
    //console.log("[Select] options:");
    //console.log(this.options);
    
    //console.log("[Select] current:");
    //console.log(inp);
    
    var tmpValidationErrors = [];
    inp.map(function (item, i) {
        var tmpError = this.valueType.validate(item);
        if (tmpError) {
            tmpValidationErrors.push({id: i, error: tmpError})
        };
    }.bind(this));
    
    if (tmpValidationErrors.length == 0) {
        // All is good, we didn't get any validation errors
        return undefined;
    } else {
        var tmpErrors = {}
        tmpValidationErrors.map(function (item) {
            tmpErrors[item.id] = item.error;
        });
        
        error = {
            type: 'list_error',
            message: "Du har missat något i formuläret",
            errors: tmpErrors
        }
        //console.log(error);
        return error;
    }
}

ListField.prototype.toFormattedString = function (inp) {
    return inp;
}

ListField.prototype.fromString = function (inp) {
    return inp;
}

module.exports = ListField;