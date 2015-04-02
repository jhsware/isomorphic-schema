'use strict';

var _ = require('lodash');

var BaseField = require('./base_fields').BaseField;

/*
    Object field
*/
var ObjectField = function (options) {
    this._isSubTypeOf = new BaseField(options);
    this._isRequired = options && options.required;
    this._schema = options && options.schema;
}

ObjectField.prototype.type = 'ObjectField';

ObjectField.prototype.validate = function (inp, options) {
    var error = this._isSubTypeOf.validate(inp);
    if (error) { return error };
    
    // Validate data and return an error object
    if (inp) {
        this._schema.validate(inp, options);
        if (this._schema.field_errors || this._schema.invariant_errors) {
            // report error if data is passed and errors are found
            return {
                type: "object_error",
                message: "Delformuläret innehåller fältfel",
                field_errors: _.cloneDeep(this._schema.field_errors),
                invariant_errors: _.cloneDeep(this._schema.invariant_errors)
            }
        }        
    }
}

ObjectField.prototype.toFormattedString = function (inp) {
    return inp;
}

ObjectField.prototype.fromString = function (inp) {
    return inp;
}

module.exports = ObjectField;