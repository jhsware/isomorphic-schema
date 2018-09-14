'use strict'

/*
    Standard options:

    required: false

*/

import { createObjectPrototype } from 'component-registry'

import { IBaseField } from '../interfaces'
import { i18n } from '../utils'


var BaseField = createObjectPrototype({
    implements: [IBaseField],

    constructor: function (options) {
        if (options) {
            this._isRequired = options.required
            delete options.required
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
        return inp
    },
    
    fromString: function (inp) {
        return inp
    }
    
})
module.exports = BaseField
