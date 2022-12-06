
import { createObjectPrototype } from 'component-registry'
import BaseField from './BaseField'
import { i18n } from '../utils'
import { cloneShallow } from '../utils'


/*

    A Select Field allows you to choose a single value from a selection

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/

// TODO: Write tests

import { IListField } from '../interfaces'

export default createObjectPrototype({
    implements: [IListField],

    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options)
        
        if (options) {
            // Always set valueType to required to get validation per item
            // Should be an instance of a field.
            this.valueType = options.valueType || options.valueFieldType
            this.options = options.options
            this._minItems = options.minItems
            delete options.minItems
            this._maxItems = options.maxItems
            delete options.maxItems
        }
        
    },
    
    validate: function (inp, options, context, async) {
        if (inp && inp.length == 0) { inp = undefined }
        var error = this._IBaseField.validate.call(this, inp)
        if (error) { return Promise.resolve(error) }
        
        // If it is undefined or null, then we just return 
        // that this value is ok
        if (!inp) {
            return Promise.resolve()
        }
        
        // Check that this is an array
        if (!(inp instanceof Array)) {
            error = {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--list_field_type_error', 'This is not a proper list. This is a bug in the application'),
                message: "This is not a proper list. This is a bug in the application"
            }
            //console.log(error)
            return Promise.resolve(error);
        }
        
        if (this._maxItems && inp.length > this._maxItems) {
            error = {
                type: 'value_error',
                i18nLabel: i18n('isomorphic-schema--list_field_value_error_too_many_items', 'Too many items in list, max ${maxItems} allowed'),
                message: 'Too many items in list, max ${maxItems} allowed'
            }
            return Promise.resolve(error);
        }
    
        if (this._minItems && inp.length < this._minItems) {
            error = {
                type: 'value_error',
                i18nLabel: i18n('isomorphic-schema--list_field_value_error_too_few_items', 'Too few items in list, min ${minItems} allowed'),
                message: 'Too few items in list, min ${minItems} allowed'
            }
            return Promise.resolve(error);
        }

        var tmpValidationErrors = []
        var validationPromises = []
        inp.forEach(function (item, i) {
            // Make sure we have a new options object...
            if (!options) {
                var newOptions = {}
            } else {
                var newOptions = cloneShallow(options)
            }
            
            // ...so we can add objectPath to determine where we are
            if (Array.isArray(newOptions.objectPath)) {
                newOptions.objectPath = newOptions.objectPath.concat([i])
            } else {
                newOptions.objectPath = [i]
            }

            if (!async) {
                var tmpError = this.valueType.validate(item, newOptions, context)
                if (tmpError) {
                    tmpValidationErrors.push({id: i, error: tmpError})
                }
            } else {
                var promise = this.valueType.validateAsync(item, newOptions, context)
                // Do not return this promise, add it to validationPromises. We will 
                // handle the list of validationPromises further down
                if (promise && promise.then) {
                    validationPromises.push(
                        promise.then(function (tmpError) {
                            if (tmpError) {
                                return Promise.resolve({id: i, error: tmpError})
                            }
                        })
                    )
                }
            }
        }.bind(this))
    
        return Promise.all(validationPromises)
            .then(function (errors) {
                // Filter out non-errors (undefined)
                errors = errors.filter(function (error) { return error })
                if (errors.length === 0) {
                    return Promise.resolve(undefined)
                } else {
                    var tmpErrors = {}
                    errors.forEach(function (err) {
                        tmpErrors[err.id] = err.error
                    })
                    return Promise.resolve({
                        type: 'list_error',
                        i18nLabel: i18n('isomorphic-schema--list_field_value_error', 'There is an error in the content of this list'),
                        message: "There is an error in the content of this list",
                        errors: tmpErrors
                    })
                }
            })
        
    },
    
    toFormattedString: function (inp) {
        return inp
    },
    
    fromString: function (inp) {
        var _this = this
        if ((inp instanceof Array)) {
            return inp.map(function (item) {
                return _this.valueType.fromString(item)
            })
        } else {
            return inp
        }
    }
})
