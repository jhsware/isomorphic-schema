'use strict';

/*
    Text area field
*/

var createObjectPrototype = require('component-registry').createObjectPrototype;

var BaseField = require('./BaseField');
var i18n = require('../utils').i18n;

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
module.exports = TextAreaField;
