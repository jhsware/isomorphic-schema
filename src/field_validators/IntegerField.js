'use strict'

/*
    Ineteger-field
*/

import { createObjectPrototype } from 'component-registry'

import BaseField from './BaseField'
import { i18n } from '../utils'

import { IIntegerField } from '../interfaces'

var reInteger = /[^0-9\.]/g

export default createObjectPrototype({
    implements: [IIntegerField],

    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options)
        if (options) {
            this._minValue = options.min
            delete options.min
            this._maxValue = options.max
            delete options.max;            
        }
    },
    
    validate: function (inp) {
        var error = this._IBaseField.validate.call(this, inp)
        if (error) { return error }

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
        return (typeof inp === 'undefined' || inp === null ? '' : inp + '')
    },
    
    fromString: function (inp) {
        if (typeof inp === "string") {
            var tmp = parseInt(inp.replace(reInteger, ""))
        } else {
            var tmp = parseInt(inp)
        }
        if (isNaN(tmp)) {
            return undefined
        } else {
            return tmp
        }
    }
})
