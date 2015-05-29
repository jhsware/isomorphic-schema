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
        if (this._isRequired && (typeof inp === "undefined" || inp === '')) {
            return {
                type: 'required',
                message: "Obligatoriskt"
            }
        }
    }
    
});

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

/*
    Ineteger-field
*/
var IIntegerField = require('../interfaces').IIntegerField;

var reInteger = /[^0-9]/g;

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

        if (!this._isRequired && (typeof inp === "undefined" || inp === '')) {
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
        var tmp = parseInt(inp.relace(reInteger, ""));
        if (isNaN(tmp)) {
            return undefined;
        } else {
            return tmp;
        }
    }
});

/*
    Text field
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


module.exports = {
    BaseField: BaseField,
    TextField: TextField,
    IntegerField: IntegerField,
    TextAreaField: TextAreaField,
    BoolField: BoolField
}
