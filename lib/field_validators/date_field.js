'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var TextField = require('./base_fields').TextField;
var moment = require('moment');

/*
    Date-field
*/
var IDateField = require('../interfaces').IDateField;

var DateField = createObjectPrototype({
    implements: [IDateField],

    extends: [TextField],
    
    constructor: function (options) {
        this._super._constructor(options);
    },
    
    validate: function (inp) {
        var error = this._super.validate(inp);
        if (error) { return error };
    
        if(inp && (inp.length != 10 || !moment(inp).isValid())) {
            error = {
                type: 'type_error',
                message: "Det ser inte ut som datum"
            }
        
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

module.exports = DateField;