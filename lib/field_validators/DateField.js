'use strict';
const { createObjectPrototype } = require('component-registry')
const isValid = require('date-fns/is_valid')
const TextField = require('./TextField');
const { i18n } = require('../utils')

/*
    Date-field
*/
const IDateField = require('../interfaces').IDateField;

const DateField = createObjectPrototype({
    implements: [IDateField],

    extends: [TextField],
    
    constructor: function (options) {
        this._ITextField.constructor.call(this, options);
    },
    
    validate: function (inp) {
        var error = this._ITextField.validate.call(this, inp);;
        if (error) { return error };
    
        if(inp && (inp.length != 10 || !isValid(new Date(inp)))) {
            error = {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--date_field_incorrect_formatting', 'This doesn\'t look like a date'),
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