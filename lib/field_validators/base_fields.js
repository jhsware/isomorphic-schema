'use strict';

/*
    Standard options:

    required: false

*/

var _ = require('lodash');
var createObjectPrototype = require('component-registry').createObjectPrototype;

var IBaseField = require('../interfaces').IBaseField;

var BaseField = createObjectPrototype({
    implements: [IBaseField],

    constructor: function (options) {
        if (options) {
            this._isRequired = options.required;
            delete options.required;
        }
    },
    
    validate: function (inp) {
        if (this._isRequired && (typeof inp === "undefined" || inp === null || inp === '')) {
            return {
                type: 'required',
                message: "Obligatoriskt"
            }
        }
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
    },
    
    validate: function (inp) {
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return error };

        if (inp && typeof inp !== "string") {
            return {
                type: 'type_error',
                message: "Fältet är inte en sträng"
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
    },
    
    validate: function (inp) {
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return error };

        if (inp && typeof inp !== "string") {
            return {
                type: 'type_error',
                message: "Fältet är inte en sträng"
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
                message: "Värdet innehåller annat än siffror"
            }
        }

        if (parseInt(inp) !== inp) {
            return {
                type: 'type_error',
                message: "Värdet får inte innehålla en decimaldel"
            }
        }

        if (typeof this._minValue !== 'undefined' && inp < this._minValue) {
            return {
                type: 'constraint_error',
                message: "Minimum " + this._minValue
            }
        }

        if (typeof this._maxValue !== 'undefined' && inp > this._maxValue) {
            return {
                type: 'constraint_error',
                message: "Max " + this._maxValue
            }
        }
    },
    
    toFormattedString: function (inp) {
        return inp + '';
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
                message: "Värdet innehåller annat än siffror"
            }
        }

        if (typeof this._minValue !== 'undefined' && parseFloat(inp) < this._minValue) {
            return {
                type: 'constraint_error',
                message: "Minimum " + this._minValue
            }
        }

        if (typeof this._maxValue !== 'undefined' && parseFloat(inp) > this._maxValue) {
            return {
                type: 'constraint_error',
                message: "Max " + this._maxValue
            }
        }
    },
    
    toFormattedString: function (inp) {
        var outp = inp + '';
        
        if (inp === null || typeof inp === "undefined") {
            return '';
        }
        // Print only nrof decimals shown in precision if set
        if (typeof this._precision !== 'undefined') {
            var tmp = outp.split('.');
            outp = tmp[0];
            if (this._precision > 0) {
                outp += '.' + (tmp[1] + '').substr(0, this._precision);
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
    
    validate: function (inp) {
        // False and undefined == false so this is always ok
        return undefined
    },
    
    toFormattedString: function (inp) {
        return inp;
    },
    
    fromString: function (inp) {
        return inp;
    }
});
module.exports.BoolField = BoolField;
