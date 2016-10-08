'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var BaseField = require('./base_fields').BaseField;
var IObjectField = require('../interfaces').IObjectField;

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
        return inp;
    }
    
});

module.exports = ObjectField;