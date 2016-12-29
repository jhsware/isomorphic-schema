'use strict';
var registry = require('component-registry').globalRegistry
var createObjectPrototype = require('component-registry').createObjectPrototype;
var DynamicSelectBaseField = require('./dynamic_select_base_field');
var i18n = require('../utils').i18n;
var Promise = require('es6-promise')

/*

    A Dynamic Select Field allows you to choose a single value from a selection
    that is created at runtime

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/

// TODO: Write tests

var IDynamicSelectAsyncBaseField = require('../interfaces').IDynamicSelectAsyncBaseField;

var DynamicSelectAsyncBaseField = createObjectPrototype({
    implements: [IDynamicSelectAsyncBaseField],

    extends: [DynamicSelectBaseField],
    
    constructor: function (options) {
        this._IDynamicSelectBaseField.constructor.call(this, options);
    },

    // DynamicSelectAsyncBaseField:
    validateAsync: function (inp, options, context) {
        // Check that this isn't undefined if it is required
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return Promise.resolve(error) };    
    
        // Since we have passed the required test we can just check if the value is undefined
        // or null and return field errors undefined 
        if (inp === null || typeof inp === 'undefined') {
            return Promise.resolve(undefined)
        };

        if (inp) {
            return this.valueType.validateAsync(inp);
        } else {
            return Promise.resolve(undefined)
        }

        /*

        Example implementation:

        var result = this._IDynamicSelectAsyncBaseField.validate.call(this, inp);

        // Check if we failed validation in DynamicSelectAsyncBaseField
        if (result) {
            return result;
        }

        return doAsyncCall(inp)
            .then(function (didMatch) {
                if (didMatch) {
                    return Promise.resolve(undefined)
                } else {
                    return Promise.resolve({
                        type: 'constraint_error',
                        i18nLabel: i18n('isomorphic-schema--select_field_value_error', 'The selected value is not allowed'),
                        message: "Valt värde finns inte i listan över tillåtna värden"
                    })
                }
            })
            .catch(function (err) {
                throw new Error('Couldn\t perform validation: ' + err.message)
            })
        */
    },

    validate: function () {
        throw new Error("You tried to call a field extending DynamicSelectAsyncBaseField synchronously, needs to be async. Use .validateAsync(...) instead!")
    },

    // This is used by formlibs
    getOptionsAsync: function (inp, options, context) {
        /*
        return doAsyncCall(inp)
            .then(function (results) {
                var outp = results.map(function (item) {
                    return { name: item.id, title: item.title }
                })
                return Promise.resolve(outp)
            })
            .catch(function (err) {
                throw new Error('Couldn\t fetch options: ' + err.message)
            })
        */
    },

    getOptions: function () {
        throw new Error("You tried to call a field extending DynamicSelectAsyncBaseField synchronously, needs to be async. Use .getOptionsAsync(...) instead!")
    },

    // This is used by formlibs
    getOptionTitleAsync: function (inp) {
        /*
        return doAsyncCall(inp)
            .then(function (title) {
                if (title) {
                    return Promise.resolve(title)
                } else {
                    return Promise.resolve({
                        type: 'value_error',
                        i18nLabel: i18n('isomorphic-schema--select_field_value_error', 'The selected value is not allowed'),
                        message: "Valt värde finns inte i listan över tillåtna värden"
                    })
                }
            })
            .catch(function (err) {
                throw new Error('Couldn\t fetch title: ' + err.message)
            })
        */
    },

    getOptionTitle: function () {
        throw new Error("You tried to call a field extending DynamicSelectAsyncBaseField synchronously, needs to be async. Use .getOptionTitleAsync(...) instead!")
    },

    toFormattedString: function (inp) {
        return this.valueType.fromString(inp);
    },

    fromString: function (inp) {
        return this.valueType.fromString(inp);
    }
});

module.exports = DynamicSelectAsyncBaseField;