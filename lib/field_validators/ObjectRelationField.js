'use strict';

const { createObjectPrototype } = require('component-registry')
const BaseField = require('./BaseField');
const IObjectRelationField = require('../interfaces').IObjectRelationField;
const { i18n } = require('../utils')

/*
    Object field
*/



const ObjectRelationField = createObjectPrototype({
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
    }
    
});

module.exports = ObjectRelationField;