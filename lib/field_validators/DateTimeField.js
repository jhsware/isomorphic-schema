'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var BaseField = require('./BaseField');
var moment = require('moment');
var i18n = require('../utils').i18n;

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
                i18nLabel: i18n('isomorphic-schema--date_time_field_incorrect_formatting', 'This doesn\'t look like a date with time'),
                message: "Det ser inte ut som ett riktigt datumobjekt med tid"
            }
    
            return error;
        };
    
    },

    toFormattedString: function (inp) {
        return inp.toISOString();
    },

    fromString: function (inp) {
        return moment.utc(inp).toDate();
    }
});

module.exports = DateTimeField;