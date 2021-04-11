'use strict'

import { createObjectPrototype } from 'component-registry'
import BaseField from './BaseField'
import { IObjectField } from '../interfaces'
import { i18n } from '../utils'

/*
    Object field
*/



export default createObjectPrototype({
    implements: [IObjectField],
    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options)
        if (options) {
            this._schema = options.schema
            this._interface = options.interface
            this.objectFactoryName = options.objectFactoryName
        }
    },
    
    validate: function (inp, options, context, async) {
        var error = this._IBaseField.validate.call(this, inp)
        if (error) { return Promise.resolve(error) }
    
        // Validate data and return an error object
        if (inp) {
            
            if (this._interface !== undefined) {
                var schema = this._interface.schema
            } else {
                var schema = this._schema
            }

            // Allow object fields without schema (useful for modelling objects that we don't know what they look like)
            if (typeof schema === 'undefined') {
              return Promise.resolve(undefined)
            }

            var promise = schema.validateAsync(inp, options, context)

            if (!(promise && promise.then)) {
                return Promise.resolve(promise)
            } else {
                return promise.then(function (formErrors) {
                    return Promise.resolve(formErrors)
                })
            }
        } else {
            return Promise.resolve(undefined)
        }
    },

    toFormattedString: function (inp) {
        return inp
    },

    fromString: function (inp, options) {
        let schema = (this._interface ? this._interface.schema : this._schema)

        if (typeof inp === 'object' && typeof schema !== 'undefined') {
            return schema.transform(inp, options)  
        } else {
            return inp
        }
    }
    
})
