'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var BaseField = require('./base_fields').BaseField;
var IObjectField = require('../interfaces').IObjectField;
var i18n = require('../utils').i18n;

/*
    Object field
*/



var ObjectField = createObjectPrototype({
    implements: [IObjectField],
    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options);
        if (options) {
            this._schema = options.schema;
            this._interface = options.interface;
            this.objectFactoryName = options.objectFactoryName;
        }
    },
    
    validate: function (inp, options) {
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return error };
    
        // Validate data and return an error object
        if (inp) {
            if (this._interface) {
                var formErrors = this._interface.schema.validate(inp, options);
            } else {
                var formErrors = this._schema.validate(inp, options);
            }
            
            if (formErrors) {
                // report error if data is passed and errors are found
                return {
                    type: "object_error",
                    i18nLabel: i18n('isomorphic-schema--object_field_value_error', 'There is an error in the content of this object'),
                    message: "Delformuläret innehåller fältfel",
                    fieldErrors: formErrors.fieldErrors,
                    invariantErrors: formErrors.invariantErrors
                }
            }        
        } else {
            return undefined;
        }
    },

    toFormattedString: function (inp) {
        return inp;
    },

    fromString: function (inp) {
        var _this = this
        if (typeof inp === 'object') {
            var outp = {};
            Object.keys(inp).forEach(function (key) {
                outp[key] = _this._schema._fields[key].fromString(inp[key]);
            })
            return outp;
        } else {
            return inp;
        }
    }
    
});

module.exports = ObjectField;