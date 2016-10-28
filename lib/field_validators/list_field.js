'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var BaseField = require('./base_fields').BaseField;
var i18n = require('../utils').i18n;

/*

    A Select Field allows you to choose a single value from a selection

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/

// TODO: Write tests

var IListField = require('../interfaces').IListField;

var ListField = createObjectPrototype({
    implements: [IListField],

    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options);
        
        if (options) {
            // Always set valueType to required to get validation per item
            // Should be an instance of a field.
            this.valueType = options.valueFieldType;
            this.options = options.options;
            this._minItems = options.minItems;
            delete options.minItems;
            this._maxItems = options.maxItems;
            delete options.maxItems;
        };
        
    },
    
    validate: function (inp) {
        if (inp && inp.length == 0) { inp = undefined };
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return error };
        
        // If it is undefined or null, then we just return 
        // that this value is ok
        if (!inp) {
            return undefined;
        }
        
        // Check that this is an array
        if (!Array.isArray(inp)) {
            error = {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--list_field_type_error', 'This is not proper list. This is a bug in the application'),
                message: "This is not proper list. This is a bug in the application"
            }
            //console.log(error);
            return error;            
        }
        
        if (this._maxItems && inp.length > this._maxItems) {
            error = {
                type: 'value_error',
                i18nLabel: i18n('isomorphic-schema--list_field_value_error_too_many_items', 'Too many items in list, max ${maxItems} allowed'),
                message: 'Too many items in list, max ${maxItems} allowed'
            }
        }
    
        if (this._minItems && inp.length < this._minItems) {
            error = {
                type: 'value_error',
                i18nLabel: i18n('isomorphic-schema--list_field_value_error_too_few_items', 'Too few items in list, min ${minItems} allowed'),
                message: 'Too few items in list, min ${minItems} allowed'
            }
        }

        var tmpValidationErrors = [];
        inp.map(function (item, i) {
            var tmpError = this.valueType.validate(item);
            if (tmpError) {
                tmpValidationErrors.push({id: i, error: tmpError})
            };
        }.bind(this));
    


        if (tmpValidationErrors.length > 0) {
            var tmpErrors = {}
            tmpValidationErrors.map(function (item) {
                tmpErrors[item.id] = item.error;
            });
        
            if (error !== undefined) {
                error.errors = tmpErrors
            } else {
                error = {
                    type: 'list_error',
                    i18nLabel: i18n('isomorphic-schema--list_field_value_error', 'There is an error in the content of this list'),
                    message: "There is an error in the content of this list",
                    errors: tmpErrors
                }
            }
        }

        // If there weren't any errors this will return undefined
        return error
    },
    
    toFormattedString: function (inp) {
        return inp;
    },
    
    fromString: function (inp) {
        return inp;
    }
});

module.exports = ListField;