'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var TextField = require('./TextField');
var moment = require('moment');
var i18n = require('../utils').i18n;

/*
    Date-field
*/
var IDateField = require('../interfaces').IDateField;

var DateField = createObjectPrototype({
    implements: [IDateField],

    extends: [TextField],
    
    constructor: function (options) {
        this._ITextField.constructor.call(this, options);
    },
    
    validate: function (inp) {
        var error = this._ITextField.validate.call(this, inp);;
        if (error) { return error };
    
        if(inp && (inp.length != 10 || !moment(inp).isValid())) {
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