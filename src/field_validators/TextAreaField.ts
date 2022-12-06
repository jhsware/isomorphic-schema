
/*
    Text area field
*/

import { createObjectPrototype } from 'component-registry'

import BaseField from './BaseField'
import { i18n } from '../utils'

import { ITextAreaField } from '../interfaces'

export default createObjectPrototype({
    implements: [ITextAreaField],
    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options)

        if (options) {
            this._minLength = options.minLength
            delete options.minLength
            this._maxLength = options.maxLength
            delete options.maxLength
        }
    },
    
    validate: function (inp) {
        var error = this._IBaseField.validate.call(this, inp)
        if (error) { return Promise.resolve(error) }

        if (!this._isRequired && (inp === null || typeof inp === "undefined" || inp === '')) {
            return Promise.resolve(error);
        }        

        if (inp && typeof inp !== "string") {
            return Promise.resolve({
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--text_area_field_no_string', 'The field doesn\'t contain text'),
                message: "Fältet är inte en sträng"
            })
        } else if (this._minLength && inp.length < this._minLength) {
            return Promise.resolve({
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--text_field_too_short', 'The text is too short. Min ${minLength} chars.'),
                message: "Texten är för kort. Minst " + this._minLength + " tkn"
            })
        } else if (this._maxLength && inp.length > this._maxLength) {
            return Promise.resolve({
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--text_field_too_long', 'The text is too long. Max ${maxLength} chars.'),
                message: "Texten är för lång. Max " + this._maxLength + " tkn"
            })
        }
        return Promise.resolve(error);
    }
})
