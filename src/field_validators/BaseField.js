'use strict'

/*
    Standard options:

    required: false

*/

import { createObjectPrototype } from 'component-registry'

import { IBaseField } from '../interfaces'
import { i18n } from '../utils'


export default createObjectPrototype({
    implements: [IBaseField],

    constructor: function (options) {
        if (options) {
            this._isRequired = options.required
            delete options.required
        }
    },
    
    validate: function (inp, options, context, async) {
        context = context || inp
        if (this._isRequired && (typeof inp === "undefined" || inp === null || inp === '')) {
            return Promise.resolve({
                type: 'required',
                i18nLabel: i18n('isomorphic-schema--field_required', 'Required'),
                message: "Obligatoriskt"
            })
        }
        return Promise.resolve()
    },

    toFormattedString: function (inp) {
        return inp
    },
    
    fromString: function (inp) {
        return inp
    }
    
})
