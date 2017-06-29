'use strict';

/*
    Decimal-field
*/

var createObjectPrototype = require('component-registry').createObjectPrototype;

var BaseField = require('./BaseField');
var i18n = require('../utils').i18n;

var IDecimalField = require('../interfaces').IDecimalField;

var reDecimal = /[^0-9\.]/g;

var DecimalField = createObjectPrototype({
    implements: [IDecimalField],

    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options);
        if (options) {
            this._minValue = options.min;
            delete options.min;
            this._maxValue = options.max;
            delete options.max;
            this._precision = options.precision && (options.precision >= 0) && options.precision;
            delete options.precision;
            
        }
    },
    
    validate: function (inp) {
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return error };

        if (!this._isRequired && (inp === null || typeof inp === "undefined" || inp === '')) {
            return
        }

        if (typeof inp !== "number" || isNaN(inp)) {
            return {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--decimal_field_not_number', 'The field doesn\'t contain numbers'),
                message: "Värdet innehåller annat än siffror"
            }
        }

        if (typeof this._minValue !== 'undefined' && parseFloat(inp) < this._minValue) {
            return {
                type: 'constraint_error',
                i18nLabel: i18n('isomorphic-schema--decimal_field_too_small', 'The value is too small. Min ${minValue}'),
                message: "Minimum " + this._minValue
            }
        }

        if (typeof this._maxValue !== 'undefined' && parseFloat(inp) > this._maxValue) {
            return {
                type: 'constraint_error',
                i18nLabel: i18n('isomorphic-schema--decimal_field_too_big', 'The value is too big. Max ${maxValue}'),
                message: "Max " + this._maxValue
            }
        }
    },
    
    toFormattedString: function (inp) {
        var outp = inp + '';
        
        if (inp === null || typeof inp === "undefined") {
            return inp;
        }
        // Print only nrof decimals shown in precision if set
        if (typeof this._precision !== 'undefined') {
            var tmp = outp.split('.');
            outp = tmp[0];
            if (this._precision > 0) {
                outp += '.' 
                if (tmp.length > 1) {
                    outp += (tmp[1] + '').substr(0, this._precision);
                }
            }
        }
        return outp;
    },
    
    fromString: function (inp) {
        if (typeof inp === "string") {
            var tmp = parseFloat(inp.replace(reDecimal, ""));
        } else {
            var tmp = parseFloat(inp);
        };
        if (isNaN(tmp)) {
            return undefined;
        } else {
            // Round to precision if set
            if (typeof this._precision !== 'undefined') {
                var tmp = tmp * Math.pow(10, this._precision);
                var tmp = Math.round(tmp);
                var tmp = tmp / Math.pow(10, this._precision);
            }
            
            return tmp;
        }
    }
});
module.exports = DecimalField;
