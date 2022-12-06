import { createObjectPrototype } from 'component-registry'
import BaseField from './BaseField'
import { i18n } from '../utils'

/*

    A Dynamic Select Field allows you to choose a single value from a selection
    that is created at runtime

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/

// TODO: Write tests

import { IDynamicSelectBaseField } from '../interfaces'

export default createObjectPrototype({
    implements: [IDynamicSelectBaseField],

    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options)
    },

    validate: function (inp, options, context) {
        // Check that this isn't undefined if it is required
        var error = this._IBaseField.validate.call(this, inp)
        if (error) { return Promise.resolve(error) }
    
        var error = inp && this.valueType.validate(inp)
        if (error) { return Promise.resolve(error) }
    
        // Since we have passed the required test we can just check if the value is undefined
        // or null and return field errors undefined 
        if (inp === null || typeof inp === 'undefined') {
            return Promise.resolve()
        }
        
        
        var options = this.getOptions(inp, options, context)
        
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
            return Promise.resolve(error)
        }

        return Promise.resolve()
    },

    toFormattedString: function (inp) {
        return this.valueType.fromString(inp)
    },

    fromString: function (inp) {
        return this.valueType.fromString(inp)
    },

    getOptions: function (inp, options, context) {},

    getOptionTitle: function (inp, options, context) {
        var selectOptions = this.getOptions(inp, options, context)
        for (var i = 0; i < selectOptions.length; i++) {
            if (selectOptions[i].name === inp) {
                return selectOptions[i].title
            }
        }
    },
})
