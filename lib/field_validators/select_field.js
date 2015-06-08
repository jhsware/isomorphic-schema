'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var BaseField = require('./base_fields').BaseField;

/*

    A Select Field allows you to choose a single value from a selection

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/

// TODO: Write tests

var ISelectField = require('../interfaces').ISelectField;

var SelectField = createObjectPrototype({
    implements: [ISelectField],

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
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return error };
    
        var error = inp && this.valueType.validate(inp);
        if (error) { return error };
    
        //console.log("[Select] options:");
        //console.log(this.options);
    
        //console.log("[Select] current:");
        //console.log(inp);
        
        // Since we have passed the required test we can just check if the value is undefined
        // or null and return field errors undefined 
        if (inp === null || typeof inp === 'undefined') {
            return
        };
        
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
    },

    toFormattedString: function (inp) {
        return this.valueType.fromString(inp);
    },

    fromString: function (inp) {
        return this.valueType.fromString(inp);
    }
});

module.exports = SelectField;