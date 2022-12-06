
import { createObjectPrototype } from 'component-registry'
import BaseField from './BaseField'
import { i18n } from '../utils'
const parse = require('date-fns/parse')
const format = require('date-fns/format')

/*
    Date-field
*/
import { IDateTimeField } from '../interfaces'

export default createObjectPrototype({
    implements: [IDateTimeField],

    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options)
    },
    
    validate: function (inp) {
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return Promise.resolve(error) }
        
        if(inp && !(inp instanceof Date)) {
            error = {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--date_time_field_incorrect_formatting', 'This doesn\'t look like a date with time'),
                message: "Det ser inte ut som ett riktigt datumobjekt med tid"
            }
    
            return Promise.resolve(error)
        }
        return Promise.resolve()
    },

    toFormattedString: function (inp) {
        return format(inp, 'YYYY-MM-DDTHH:mm:ssZ')
    },

    fromString: function (inp) {
        return parse(inp)
    }
})
