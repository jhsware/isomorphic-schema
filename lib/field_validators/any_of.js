'use strict';

/*
    Standard options:

    required: false

*/

var createObjectPrototype = require('component-registry').createObjectPrototype;

var IAnyOf = require('../interfaces').IAnyOf;
var i18n = require('../utils').i18n;
var Promise = require('es6-promise');
var BaseField = require('./base_fields').BaseField

var AnyOf = createObjectPrototype({
    extends: [BaseField],
    implements: [IAnyOf],

    constructor: function (options) {
        this._IBaseField.constructor.call(this, options);
        if (options) {
            this._valueTypes = options.valueTypes;
            delete options.valueTypes;
        }
    },
    
    // TODO: Validate against one of several
    validate: function (inp, options, context, async) {
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return error };

        if (inp) {
            if (async) {
                var errorPromises = this._valueTypes.map(function (field) {
                    return field.validateAsync(inp, options, context)
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
                    return field.validate(inp, options, context)
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
                return undefined;
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
    
});
module.exports = AnyOf;
