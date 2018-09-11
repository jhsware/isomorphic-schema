'use strict';

const { createObjectPrototype } = require('component-registry')
const BaseField = require('./BaseField');
const moment = require('moment');
const { i18n } = require('../utils')

/*
    Date-field
*/
const IDateTimeField = require('../interfaces').IDateTimeField;

const DateTimeField = createObjectPrototype({
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