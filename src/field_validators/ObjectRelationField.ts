
import { createObjectPrototype } from 'component-registry'
import {BaseField} from './BaseField'
import { IObjectRelationField } from '../interfaces'
import { i18n } from '../utils'

/*
    Object field
*/



export default createObjectPrototype({
    implements: [IObjectRelationField],
    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor.call(this, options)
        if (options) {
            this._resolverName = options.resolverName
            this._interface = options.interface
        }
    },
    
    async validate(inp, options) {
        // We need to resolve the relation to validate it
        var val = inp.get()
        
        var error = await this._IBaseField.validate.call(this, val)
        if (error) { return Promise.resolve(error) }
    
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
            return undefined
        }
        */
        return undefined
    }
    
})
