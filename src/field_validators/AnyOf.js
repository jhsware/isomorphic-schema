'use strict'

/*
    Standard options:

    required: false

*/

import { createObjectPrototype } from 'component-registry'

import { IAnyOf } from '../interfaces'
import { i18n } from '../utils'

import BaseField from './BaseField'

const AnyOf = createObjectPrototype({
    extends: [BaseField],
    implements: [IAnyOf],

    constructor: function (options) {
        this._IBaseField.constructor.call(this, options)
        if (options) {
            this._valueTypes = options.valueTypes
            delete options.valueTypes
        }
    },
    
    // TODO: Validate against one of several
    validate: function (inp, options, context, async) {
        var error = this._IBaseField.validate.call(this, inp)
        if (error) { return error }

        if (inp) {
            if (async) {
                var errorPromises = this._valueTypes.map(function (field) {
                    // Convert value so it can be checked properly, but if it converts to empty or undefined use original value
                    var tmp = field.fromString(inp)
                    return field.validateAsync(tmp || inp, options, context)
                })

                return Promise.all(errorPromises).then(function (fieldErrors) {
                    var error = fieldErrors.reduce(function (curr, next) {
                        // If one of the validators pass we are ok
                        if (next === undefined) {
                            return undefined
                        } else {
                            return curr
                        }
                    }, {
                        type: 'constraint_error',
                        i18nLabel: i18n('isomorphic-schema--any_of_error', 'The entered value doesn\'t match any of the allowed value types'),
                        message: 'Inmatat värde matchar inte de tillåtna alternativen'
                    })
                    return Promise.resolve(error)
                })
            } else {
                // Sync validate
                var fieldErrors = this._valueTypes.map(function (field) {
                    // Convert value so it can be checked properly, but if it converts to empty or undefined use original value
                    var tmp = field.fromString(inp)
                    return field.validate(tmp || inp, options, context)
                })
                var error = fieldErrors.reduce(function (curr, next) {
                    // If one of the validators pass we are ok
                    if (next === undefined) {
                        return undefined
                    } else {
                        return curr
                    }
                }, {
                    type: 'constraint_error',
                    i18nLabel: i18n('isomorphic-schema--any_of_error', 'The entered value doesn\'t match any of the allowed value types'),
                    message: 'Inmatat värde matchar inte de tillåtna alternativen'
                })
                return error
            }
        } else {
            if (!async) {
                return undefined
            } else {
                return Promise.resolve(undefined)
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
module.exports = AnyOf
