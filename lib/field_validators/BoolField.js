'use strict';

/*
    Bool field
*/

const { createObjectPrototype } = require('component-registry')

const { IBoolField } = require('../interfaces')

const BoolField = createObjectPrototype({
    implements: [IBoolField],
    
    constructor: function (options) {
        
    },

    validateAsync: function (inp, options, context) {
        return this.validate(inp, options, context, true)
    },
    
    validate: function (inp) {
        // False and undefined == false so this is always ok
        return undefined
    },
    
    toFormattedString: function (inp) {
        return inp;
    },
    
    fromString: function (inp) {
        if (inp == "true" || inp === true) {
            return true;
        } else if (inp == "false" || inp === false) {
            return false;
        } else if (inp === "undefined" || inp === undefined ){
            return undefined;
        } else if (inp === 'null' || inp === null) {
            return null;
        } else {
            return inp
        }
    }
});
module.exports = BoolField;
