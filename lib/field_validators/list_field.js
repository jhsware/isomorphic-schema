'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var BaseField = require('./base_fields').BaseField;

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
                message: "Det här är ingen riktig lista. Det är ett internt, tekniskt, fel"
            }
            //console.log(error);
            return error;            
        }
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
    },
    
    toFormattedString: function (inp) {
        return inp;
    },
    
    fromString: function (inp) {
        return inp;
    }
});

module.exports = ListField;