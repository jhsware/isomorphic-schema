'use strict'

/*
    Bool field
*/

import { createObjectPrototype } from 'component-registry'

import { IBoolField } from '../interfaces'

export default createObjectPrototype({
    implements: [IBoolField],
    
    constructor: function (options) {
        
    },

    validate: function (inp) {
        // False and undefined == false so this is always ok
        return Promise.resolve()
    },
    
    toFormattedString: function (inp) {
        return inp
    },
    
    fromString: function (inp) {
        if (inp == "true" || inp === true) {
            return true
        } else if (inp == "false" || inp === false) {
            return false
        } else if (inp === "undefined" || inp === undefined ){
            return undefined
        } else if (inp === 'null' || inp === null) {
            return null
        } else {
            return inp
        }
    }
})
