'use strict';

/*
    Standard options:

    required: false

*/

var createObjectPrototype = require('component-registry').createObjectPrototype;

var IBaseField = require('../interfaces').IBaseField;
var i18n = require('../utils').i18n;
var Promise = require('es6-promise');

var BaseField = createObjectPrototype({
    implements: [IBaseField],

    constructor: function (options) {
        if (options) {
            this._isRequired = options.required;
            delete options.required;
        }
    },

    validateAsync: function (inp, options, context) {
        var tmp = this.validate(inp, options, context, true)
        if (tmp && tmp.then) {
            return tmp
        } else {
            return Promise.resolve(tmp)
        }
    },
    
    validate: function (inp, options, context, async) {
        context = context || inp
        if (this._isRequired && (typeof inp === "undefined" || inp === null || inp === '')) {
            return {
                type: 'required',
                i18nLabel: i18n('isomorphic-schema--field_required', 'Required'),
                message: "Obligatoriskt"
            }
        }
    },

    toFormattedString: function (inp) {
        return inp;
    },
    
    fromString: function (inp) {
        return inp;
    }
    
});
module.exports.BaseField = BaseField;

/*
    Text field
*/
var ITextField = require('../interfaces').ITextField;

var TextField = createObjectPrototype({
    implements: [ITextField],
    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options);
        
        if (options) {
            this._minLength = options.minLength;
            delete options.minLength;
            this._maxLength = options.maxLength;
            delete options.maxLength;
            this._trim = options.trim;
            delete options.trim;
        }
    },
    
    validate: function (inp) {
        if (this._trim) {
            inp = inp.trim();
        }

        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return error };

        if (!this._isRequired && (inp === null || typeof inp === "undefined" || inp === '')) {
            return
        }

        // TODO: Check for line breaks
        if (inp && typeof inp !== "string") {
            return {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--text_field_no_string', 'The field doesn\'t contain text'),
                message: "Fältet är inte en sträng"
            }
        } else if (this._minLength && inp.length < this._minLength) {
            return {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--text_field_too_short', 'The text is too short. Min ${minLength} chars.'),
                message: "Texten är för kort. Minst " + this._minLength + " tkn"
            }
        } else if (this._maxLength && inp.length > this._maxLength) {
            return {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--text_field_too_long', 'The text is too long. Max ${maxLength} chars.'),
                message: "Texten är för lång. Max " + this._maxLength + " tkn"
            }
        }
    },

    fromString: function (inp) {
        if (this._trim) {
            return inp.trim();
        } else {
            return inp;
        }
    }
});
module.exports.TextField = TextField;

/*
    Text field
*/
var ITextAreaField = require('../interfaces').ITextAreaField;

var TextAreaField = createObjectPrototype({
    implements: [ITextAreaField],
    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options);

        if (options) {
            this._minLength = options.minLength;
            delete options.minLength;
            this._maxLength = options.maxLength;
            delete options.maxLength;
        }
    },
    
    validate: function (inp) {
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return error };

        if (!this._isRequired && (inp === null || typeof inp === "undefined" || inp === '')) {
            return
        }        

        if (inp && typeof inp !== "string") {
            return {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--text_area_field_no_string', 'The field doesn\'t contain text'),
                message: "Fältet är inte en sträng"
            }
        } else if (this._minLength && inp.length < this._minLength) {
            return {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--text_field_too_short', 'The text is too short. Min ${minLength} chars.'),
                message: "Texten är för kort. Minst " + this._minLength + " tkn"
            }
        } else if (this._maxLength && inp.length > this._maxLength) {
            return {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--text_field_too_long', 'The text is too long. Max ${maxLength} chars.'),
                message: "Texten är för lång. Max " + this._maxLength + " tkn"
            }
        }
    }
});
module.exports.TextAreaField = TextAreaField;


/*
    Ineteger-field
*/
var IIntegerField = require('../interfaces').IIntegerField;

var reInteger = /[^0-9\.]/g;

var IntegerField = createObjectPrototype({
    implements: [IIntegerField],

    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options);
        if (options) {
            this._minValue = options.min;
            delete options.min;
            this._maxValue = options.max;
            delete options.max;            
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
                i18nLabel: i18n('isomorphic-schema--integer_field_not_number', 'The field doesn\'t contain numbers'),
                message: "Värdet innehåller annat än siffror"
            }
        }

        if (parseInt(inp) !== inp) {
            return {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--integer_field_no_decimals', 'The field may not contain decimals'),
                message: "Värdet får inte innehålla en decimaldel"
            }
        }

        if (typeof this._minValue !== 'undefined' && inp < this._minValue) {
            return {
                type: 'constraint_error',
                i18nLabel: i18n('isomorphic-schema--integer_field_too_small', 'The value is too small. Min ${minValue}'),
                message: "Minimum " + this._minValue
            }
        }

        if (typeof this._maxValue !== 'undefined' && inp > this._maxValue) {
            return {
                type: 'constraint_error',
                i18nLabel: i18n('isomorphic-schema--integer_field_too_big', 'The value is too big. Max ${maxValue}'),
                message: "Max " + this._maxValue
            }
        }
    },
    
    toFormattedString: function (inp) {
        return (typeof inp === 'undefined' || inp === null ? '' : inp + '');
    },
    
    fromString: function (inp) {
        if (typeof inp === "string") {
            var tmp = parseInt(inp.replace(reInteger, ""));
        } else {
            var tmp = parseInt(inp);
        };
        if (isNaN(tmp)) {
            return undefined;
        } else {
            return tmp;
        }
    }
});
module.exports.IntegerField = IntegerField;


/*
    Decimal-field
*/
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
module.exports.DecimalField = DecimalField;


/*
    Bool field
*/
var IBoolField = require('../interfaces').IBoolField;

var BoolField = createObjectPrototype({
    implements: [IBoolField],
    
    constructor: function (options) {
        
    },

    validateAsync: function (inp, options, context) {
        return this.validate(inp, options, context, true)
    },
    
    validate: function (inp) {
        // False and undefined == false so this is always ok
        return undefined
    },
    
    toFormattedString: function (inp) {
        return inp;
    },
    
    fromString: function (inp) {
        if (inp == "true" || inp === true) {
            return true;
        } else if (inp == "false" || inp === false) {
            return false;
        } else if (inp === "undefined" || inp === undefined ){
            return undefined;
        } else if (inp === 'null' || inp === null) {
            return null;
        } else {
            return inp
        }
    }
});
module.exports.BoolField = BoolField;
