'use strict'

import { createObjectPrototype } from 'component-registry'
import TextField from './TextField'
import { i18n } from '../utils'

/*
    Credit card field validator

    Port of:
    http://jquerycreditcardvalidator.com/
*/
import { IOrgNrField } from '../interfaces'

export default createObjectPrototype({
    implements: [IOrgNrField],

    extends: [TextField],
    
    constructor: function (options) {
        this._ITextField.constructor.call(this, options)
    },
    
    validate: function (inp) {
        var error = this._ITextField.validate.call(this, inp)
        if (error) { return error }

        if (inp) {
            var message
            try {
                var error = _validateOrgNr(inp)
        
            } catch (e) {
                var type = 'value_error'
                const i18nLabel = i18n('isomorphic-schema--org_nr_field_incorrect_formatting', 'Malformatted'),
                message = "Inmatat organisations-/personnummer har något seriöst fel"
            } finally {
                if (!message && error) {
                    var type = 'type_error'
                    message = error.message
                    var i18nLabel = error.i18nLabel
                }
                if (message) {
                    return {
                        type: type,
                        i18nLabel: i18nLabel,
                        message: message
                    };                
                }
            }
        }
    },
    
    toFormattedString: function (inp) {
        if (inp) {
            var tmp = inp.match(/.{1,8}/g)
            return tmp.join("-");       
        } else {
            return ""
        }
    },

    fromString: function (inp) {
        var tmp = inp.replace(/([^0-9]*)/g, '')
        if (tmp.length > 12) {
            tmp = tmp.split("")
            tmp = tmp.splice(0,12)
            tmp = tmp.join("")
        }
        return tmp
    }
})

var _validateOrgNr = function(inp, options) {
    /*
           8  1 1 2 1 8  9 8  7 6
        *  2  1 2 1 2 1  2 1  2 1
        -------------------------
           ^  ^ ^ ^ ^ ^  ^ ^  ^ 
          16  1 2 2 2 8 18 8 14 6
    
        1+6+1+2+2+2+8+1+8+8+1+4+6 = 50
    */
    
    var inpLst = inp.split("")
    if (inpLst.length < 12) {
        return {
            i18nLabel: i18n('isomorphic-schema--org_nr_field_too_short', 'Entered number is too short'),
            message: "Inmatat nummer är för kort"
        }
    }
    
    var luhLst = [0,0,2,1,2,1,2,1,2,1,2,1]
    var calcLst = luhLst.map(function (val, i) {
        return  luhLst[i] * parseInt(inpLst[i])
    })
    var tmp = 0
    calcLst.map(function (val) {
        tmp += (val % 10) + Math.floor(val/10)
    })
    if (tmp % 10 == 0) {
        return undefined
    } else {
        return {
            i18nLabel: i18n('isomorphic-schema--org_nr_field_wrong_checksum', 'The entered number is incorrect (checksum error)'),
            message: "Kontrollsiffran stämmer inte"
        }
    }
}