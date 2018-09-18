'use strict'

import { createObjectPrototype } from 'component-registry'
import BaseField from './BaseField'
import { i18n } from '../utils'


/*

    A Select Field allows you to choose a single value from a selection

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/

// TODO: Write tests

import { IMultiSelectField } from '../interfaces'

export default createObjectPrototype({
    implements: [IMultiSelectField],

    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options)
        
        if (options) {
            // Always set valueType to required to get validation per item
            // Should be an instance of a field.
            this.valueType = options.valueType; 
            this.options = options.options;            
        }
        
    },
    
    validate: function (inp, options, context, async) {
        // Check that this isn't undefined if it is required
        var error = this._IBaseField.validate.call(this, inp)
        if (error) { return error }
        
        // If undefined and not required just return ok
        if (typeof inp === 'undefined' || inp === null) {
            return
        }
        
        // We need to check every item in the list to see that they are valid
        var errors = inp.map(function (item) {
            // Chack value is of valueType
            var error = this.valueType.validate(item)
            if (typeof error !== 'undefined') {
                if (!aync) {
                    return error
                } else {
                    return Promise.resolve(error)
                }
            }

            var options = this.options

            // Check that selected value is in options list
            var matches = false
            for (var i = 0; i < options.length; i++) {
                if (options[i].name === item) {
                    matches = true
                    break
                }
            }
            if (!matches) {
                return {
                    type: 'constraint_error',
                    i18nLabel: i18n('isomorphic-schema--multi_select_field_value_error', 'One or more of the selected values is not allowed'),
                    message: "Ett eller flera valda värden finns inte i listan över tillåtna värden"
                }
            }
        }.bind(this)).filter(function (item) {return typeof item !== 'undefined'})
        if (!async || errors.length === 0) {
            return errors[0]
        } else {
            return Promise.all(errors)
                .then(function (results) {
                    var results = results.filter(function (item) { item !== undefined })
                    return Promise.resolve(results[0])
                })
        }
    },

    toFormattedString: function (inp) {
        return inp
    },

    fromString: function (inp) {
        return inp
    },

    getOptionTitle: function (name) {
        for (var i=0; i < this.options.length; i++) {
            if (this.options[i].name === name) return this.options[i].title 
        }
    }
})
