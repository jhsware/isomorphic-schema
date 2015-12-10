'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var BaseField = require('./base_fields').BaseField;
var moment = require('moment');

/*
    Date-field
*/
var IDateTimeField = require('../interfaces').IDateTimeField;

var DateTimeField = createObjectPrototype({
    implements: [IDateTimeField],

    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options);
    },
    
    validate: function (inp) {
        var error = this._IBaseField.validate.call(this, inp);;
        if (error) { return error };
        
        if(inp && !(inp instanceof Date)) {
            error = {
                type: 'type_error',
                message: "Det ser inte ut som ett riktigt datumobjekt med tid"
            }
    
            return error;
        };
    
    },

    toFormattedString: function (inp) {
        return inp.toISOString();
    },

    fromString: function (inp) {
        return moment(inp).toDate();
    }
});

module.exports = DateTimeField;