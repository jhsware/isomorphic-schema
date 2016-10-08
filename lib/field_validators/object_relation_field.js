'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var BaseField = require('./base_fields').BaseField;
var IObjectRelationField = require('../interfaces').IObjectRelationField;

/*
    Object field
*/



var ObjectRelationField = createObjectPrototype({
    implements: [IObjectRelationField],
    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options);
        if (options) {
            this._resolverName = options.resolverName;
            this._interface = options.interface;
        }
    },
    
    validate: function (inp, options) {
        // We need to resolve the relation to validate it
        var val = inp.get();
        
        var error = this._IBaseField.validate.call(this, val);
        if (error) { return error };
    
        /*
        // TODO: Implement object type validation
        // TODO: Consider implementing test on server for existence of related object
        // Validate data and return an error object
        if (val) {
            if (this._inte && this._objectType !== val._type) {
                
                // The related object doesn't implement any of the accepted interfaces
                return {
                    type: "relation_error",
                    message: "Relaterat objekt är av fel typ, ska vara: " + this._objectType
                }
            }            
        } else {
            return undefined;
        }
        */
        return undefined;
    },

    toFormattedString: function (inp) {
        return inp;
    },

    fromString: function (inp) {
        return inp;
    }
    
});

module.exports = ObjectRelationField;