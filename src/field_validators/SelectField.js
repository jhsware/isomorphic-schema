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

import { ISelectField } from '../interfaces'

export default createObjectPrototype({
    implements: [ISelectField],

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
        var error = this._IBaseField.validate.call(this, inp)
        if (error) { return Promise.resolve(error) }
    
        var error = inp && this.valueType.validate(inp)
        if (error) { return Promise.resolve(error) }
    
        //console.log("[Select] options:")
        //console.log(this.options)
    
        //console.log("[Select] current:")
        //console.log(inp)
        
        // Since we have passed the required test we can just check if the value is undefined
        // or null and return field errors undefined 
        if (inp === null || typeof inp === 'undefined') {
            return Promise.resolve();
        }
        
        var options = this.options

        var matches = false
        for (var i = 0; i < options.length; i++) {
            if (options[i].name === inp) {
                matches = true
                break
            }
        }
    
        if (!matches) {
            error = {
                type: 'constraint_error',
                i18nLabel: i18n('isomorphic-schema--select_field_value_error', 'The selected value is not allowed'),
                message: "Valt värde finns inte i listan över tillåtna värden"
            }
            //console.log(error)
            return Promise.resolve(error);
        }
        return Promise.resolve();
    },

    toFormattedString: function (inp) {
        return this.valueType.fromString(inp)
    },

    fromString: function (inp) {
        return this.valueType.fromString(inp)
    },

    getOptionTitle: function (inp) {
        for (var i=0; i < this.options.length; i++) {
            if (this.options[i].name === inp) return this.options[i].title 
        }
    }
})
