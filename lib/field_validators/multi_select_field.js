'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var BaseField = require('./base_fields').BaseField;

/*

    A Select Field allows you to choose a single value from a selection

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/

// TODO: Write tests

var IMultiSelectField = require('../interfaces').IMultiSelectField;

var MultiSelectField = createObjectPrototype({
    implements: [IMultiSelectField],

    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options);
        
        if (options) {
            // Always set valueType to required to get validation per item
            // Should be an instance of a field.
            this.valueType = options.valueType; 
            this.options = options.options;            
        };
        
    },
    
    validate: function (inp) {
        // Check that this isn't undefined if it is required
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return error };
        
        // If undefined and not required just return ok
        if (typeof inp === 'undefined' || inp === null) {
            return
        }
        
        // We need to check every item in the list to see that they are valid
        var errors = inp.map(function (item) {
            var matches = this.options.filter(function (option) {
                return option.name === item;
            })
            
            // Chack value is of valueType
            var error = this.valueType.validate(item);
            if (typeof error !== 'undefined') {
                return error;
            }
    
            // Chack that selected value is in options list
            if (matches.length < 1) {
                error = {
                    type: 'constraint_error',
                    message: "Ett eller flera valda värden finns inte i listan över tillåtna värden"
                }
                //console.log(error);
                return error;
            }
        }.bind(this)).filter(function (item) {return typeof item !== 'undefined'})
        if (errors.length > 0) {
            return errors[0]
        };
    
    
    },

    toFormattedString: function (inp) {
        return inp;
    },

    fromString: function (inp) {
        return inp;
    }
});

module.exports = MultiSelectField;