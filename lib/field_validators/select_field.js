'use strict';
var registry = require('component-registry').globalRegistry
var createObjectPrototype = require('component-registry').createObjectPrototype;
var BaseField = require('./base_fields').BaseField;
var i18n = require('../utils').i18n;

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
    
    validate: function (inp, options, context) {
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
        
        if (!Array.isArray(this.options) && this.options.utilityInterface) {
            try {
                var util = registry.getUtility(this.options.utilityInterface, this.options.name)
            } catch (err) {
                throw new Error("Select field can't find utility (" + this.options.utilityInterface.name + ", " + this.options.name + ")")
            }
            // TODO: Handle if we get a Promise from getOptions!
            var options = util.getOptions(inp, options, context)
        } else {
            var options = this.options
        }

        var matches = options.filter(function (option) {
            return option.name === inp;
        })
    
        if (matches.length < 1) {
            error = {
                type: 'constraint_error',
                i18nLabel: i18n('isomorphic-schema--select_field_value_error', 'The selected value is not allowed'),
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
    },

    getOptionTitle: function (inp, options, context) {
        if (!Array.isArray(this.options) && this.options.utilityInterface) {
            var util = registry.getUtility(this.options.utilityInterface, this.options.name, undefined)
            return util.getOptionTitle(inp, options, context)
        } else {
            for (var i=0; i < this.options.length; i++) {
                if (this.options[i].name === inp) return this.options[i].title 
            }
        }
    }
});

module.exports = SelectField;