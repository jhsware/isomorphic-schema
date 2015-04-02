'use strict';

/*
    Standard options:

    required: false

*/

var _ = require('lodash');

var BaseField = function (options) {

    this._isRequired = options && options.required;

}

BaseField.prototype.type = 'BaseField';

BaseField.prototype.validate = function (inp) {
    if (this._isRequired && (typeof inp === "undefined" || inp === '')) {
        return {
            type: 'required',
            message: "Obligatoriskt"
        }
    }
}

/*
    Text field
*/
var TextField = function (options) {
    this._isSubTypeOf = new BaseField(options);
    this._isRequired = options && options.required;
}

TextField.prototype.type = 'TextField';

TextField.prototype.validate = function (inp) {
    var error = this._isSubTypeOf.validate(inp);
    if (error) { return error };

    if (inp && typeof inp !== "string") {
        return {
            type: 'type_error',
            message: "Fältet är inte en sträng"
        }
    }
}

TextField.prototype.toFormattedString = function (inp) {
    return inp;
}

TextField.prototype.fromString = function (inp) {
    return inp;
}

/*
    Ineteger-field
*/
var IntegerField = function (options) {
    this._isSubTypeOf = new BaseField(options);
    this._isRequired = options && options.required;
    this._minValue = options && options.min;
    this._maxValue = options && options.max;
}

IntegerField.prototype.type = 'IntegerField';

IntegerField.prototype.validate = function (inp) {
    var error = this._isSubTypeOf.validate(inp);
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

    if (this._minValue && inp < this._minValue) {
        return {
            type: 'constraint_error',
            message: "Minimum " + this._minValue
        }
    }

    if (this._maxValue && inp > this._maxValue) {
        return {
            type: 'constraint_error',
            message: "Max " + this._maxValue
        }
    }
}

IntegerField.prototype.toFormattedString = function (inp) {
    return inp + '';
}

IntegerField.prototype.fromString = function (inp) {
    var tmp = parseInt(inp);
    if (isNaN(tmp)) {
        return undefined;
    } else {
        return tmp;
    }
}

module.exports = {
    BaseField: BaseField,
    TextField: TextField,
    IntegerField: IntegerField,
}
