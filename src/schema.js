'use strict'

/*
    Example of field definitions:
    
    fieldDefs = {
        field_name: {
            validator: function (inp) {
                return {
                    message: "This field is required"
                }
            },
            required: false
        }
    }

    invariantDefs = [
        function (data, selectedFields) {
            return {
                message: "bla bla",
                fields: ['field_name', 'field_name']
            }
        }
    ]
*/

class Schema { 
    /**
     * Create a form or object schema. You would normally use one of the predefined field types
     * in isomorphic-schema or a subclass of these in order to support auto-generated forms.
     * 
     * However, this isn't required as long as you provide an object of the kind:
     * { validator(), fromString() }
     * 
     * Passing schema name as first param is legacy but common. It won't be deprecated, but doesn't
     * support 'extends'.
     * 
     * @param {(string|Object)} opts – configuration object
     * @param {string} opts.schemaName – name of schema
     * @param {Object} opts.fields – schema fields
     * @param {Object[]} opts.extends – list of schemas to extend for composition (experimental)
     * @param {Object=} fieldDefs – schema fields (overridden if fields are passed in first param)
     * @returns {Object}
     */
    constructor (opts, fieldDefs) {
        if (typeof opts === 'string') {
            // Backward compatibility
            var schemaName = opts
        } else {
            var schemaName = opts.schemaName
            fieldDefs = fieldDefs || opts.fields
        }
        
        // Check that we paased a schema name (used for debugging)
        if (typeof schemaName !== 'string') {
            throw {
                message: "You didn't pass a name to the schema",
                data: {
                    schemaName: schemaName,
                    fieldDefs: fieldDefs
                }
            }
        }
        
        this._name = schemaName
        this._fields = {}
        this._invariants = []
        this._validationConstraints = []

        // Check if we are extending other schemas
        if (Array.isArray(opts.extends)) {
            // Fields in schemas to the right will override those to the left
            opts.extends.map(function (schema) {
                for (var key in schema._fields) {
                    this._fields[key] = schema._fields[key]
                }
                for (var key in schema._invariants) {
                    this._invariants.push(schema._invariants[key])
                }
                for (var key in schema._validationConstraints) {
                    this._validationConstraints.push(schema._validationConstraints[key])
                }
            }.bind(this))
        }
        
        for (var key in fieldDefs) {
            this._fields[key] = fieldDefs[key]
        }
    }

    /**
     * If this function returns undefined then there is no invariant error. If there is an invariant error
     *
     * @callback invariantCondition
     * @param {Object} data – the complete data of the current object.
     * @param {string[]} selectedFields – list of all fields that are active (respecting selected and omitted fields)
     */

    /**
     * Add an invariant validation rule. You use it to make sure a max value is larger than a min value or that
     * password equals to confirmPassword etc.
     * @param {invariantCondition} invariant
     */
    addInvariant(invariant) {
        // TODO: Check that it is valid
        this._invariants.push(invariant)
    }

    /**
     * If this function returns true the field is included. Perhaps you only want to include a field
     * if another field is of a certain value.
     *
     * @callback validationConstraint
     * @param {Object} data – the complete data of the current object.
     * @param {string} fieldKey – dot notation path to field being evaluated.
     * @returns {boolean}
     */
    
    /**
     * Add a condition under which the field should be active. Used when generating forms and during validation
     * 
     * @param {validationConstraint} constraint – the validation constraint
     */
    addValidationConstraint(constraint) {
        // TODO: Check that it is valid
        this._validationConstraints.push(constraint)
    }
    
    _addFieldError(formErrors, propName, error) {
        if (typeof formErrors.fieldErrors === "undefined") {
            formErrors.fieldErrors = {}
        }
        formErrors.fieldErrors[propName] = error
    }
    
    _addInvariantError(formErrors, error) {
        if (typeof formErrors.invariantErrors === "undefined") {
            formErrors.invariantErrors = []
        }
        formErrors.invariantErrors.push(error)
    }
    
    _getSelectedFieldsList(selected, omitted, objectPath) {
        const namespace = (Array.isArray(objectPath) && objectPath.join('.')) || ''
        const newFieldOptions = {}
        if (typeof selected === "string") {
          selected = selected.split(',')
        }

        if (typeof omitted === "string") {
          omitted = omitted.split(',')
        }

        const selectedFields = []
        
        for (var key in this._fields) {
          const dottedName = namespace ? `${namespace}.${key}` : key

          if (selected === undefined || selected.indexOf(dottedName) >= 0) {
            // This field has been selected
            if (!omitted || omitted.indexOf(dottedName) < 0 ) {
              // And not omitted
              selectedFields.push(key)
            }
          }
        }

        // Remove root level props so they aren't counted when we pass on to next level
        // so we can select all if none are passed
        if (Array.isArray(selected)) {
          selected = selected.filter((key) => key.indexOf('.') >= 0)
        }

        return {
          selectedFields,
          newFieldOptions
        }
    }
    
    /**
     * Validate data async using defined schema. Allways returns a promise
     * @param {Object} data – the data input to be validated
     * @param {Object} options – options object
     * @param {(string|string[])} options.selected – only include selected fields (comma separated list, or array, of prop names)
     * @param {(string|string[])} options.omitted – omit omitted fields (comma separated list, or array, of prop names)
     * @param {string[]} options.objectPath – path to input object, used when transforming nested object
     * @param {Object} context – the entire data object which can be used by a field for conditional validation against other props
     * @returns {Promise}
     */
    validateAsync(data, options, context) {
        return this.validate(data, options, context || data, true)
    }
    
    /**
     * Validate data using defined schema.
     * @param {Object} data – the data input to be validated
     * @param {Object} options – options object
     * @param {(string|string[])} options.selected – only include selected fields (comma separated list, or array, of prop names)
     * @param {(string|string[])} options.omitted – omit omitted fields (comma separated list, or array, of prop names)
     * @param {string[]} options.objectPath – path to input object, used when transforming nested object
     * @param {Object} context – the entire data object which can be used by a field for conditional validation against other props
     * @param {boolean} async – (use validateAsync instead) data is validated async because schema contains async fields. This will return a promise
     * @returns {(undefined|Object|Promise)} – returns error object if validation errors are found
     */
    validate(data, options, context, async) {    
        let skipInvariants = false,
            selected = undefined,
            omitted = undefined
        
        if (options) {
            skipInvariants = options.skipInvariants || false
            selected = options.selectedFields || options.selectFields
            omitted = options.omittedFields || options.omitFields
        }
        
        // We are making the validation stateless to avoid contaminating schemas
        // that are now used as a way to define the object model
        var formErrors = {
            fieldErrors: undefined,
            invariantErrors: undefined
        }
        
        
        const { selectedFields, newFieldOptions } = this._getSelectedFieldsList(selected, omitted, options && options['objectPath'])
        
        var validationPromises = []
        // Validate selected fields
        for (var i in selectedFields) {
            var key = selectedFields[i]
            
            // Make sure we have a new options object...
            if (!options) {
                var newOptions = {}
            } else {
                var newOptions = Object.assign({}, options, newFieldOptions)
            }
            
            // ...so we can add objectPath to determine where we are
            if (Array.isArray(newOptions.objectPath)) {
                newOptions.objectPath = newOptions.objectPath.concat([key])
            } else {
                newOptions.objectPath = [key]
            }
            
            // Remove the selectedFields if passed because we don't want them to be sent to next validate function
            if (newOptions.selectedFields) {
                delete newOptions.selectedFields
            }
            
            // console.log("[Schema] validating: " + newOptions.objectPath.join("."))
            
            try {
                
                // Check validation constraints
                var failedValidators = this._validationConstraints.filter(function (constraint) {
                    return !constraint(data, key, options)
                })
                // Only validate if we pass all the validation constraints
                if (failedValidators.length === 0) {
                    if (!this._fields[key].readOnly) {
                        if (!async) {
                            var tmpError = this._fields[key].validate(data[key], newOptions, context || data)
                            tmpError && this._addFieldError(formErrors, key, tmpError)
                        } else {
                            var tmpPromise = this._fields[key].validateAsync(data[key], newOptions, context || data)
                            if (!(tmpPromise && tmpPromise.then)) {
                                // We didn't get a promise so this validation was synchronous
                                var tmpError = tmpPromise
                                tmpError && this._addFieldError(formErrors, key, tmpError)
                                validationPromises.push(Promise.resolve(formErrors))
                                // Errors are added when promises are resolved at end of this function
                            } else {
                                var _this = this;
                                (function (formErrors, key) {
                                    validationPromises.push(tmpPromise.then(function (tmpError) {
                                        tmpError && _this._addFieldError(formErrors, key, tmpError)
                                        return Promise.resolve(formErrors)
                                    }))
                                })(formErrors, key)
                            }
                            
                        }
                    }
                }            
            } catch (e) {
                console.error('[Schema] Field validation error for: ' + key)
                console.log(data && data[key])
                throw e
            }
        }
        
        if (!skipInvariants) {
        
            // Validate invariants
            for (var i = 0, imax = this._invariants.length; i < imax; i++) {
                try {
                    if (!async) {
                        var tmpError = this._invariants[i](data, selectedFields, options)
                        tmpError && this._addInvariantError(formErrors, tmpError)
                    } else {
                        var tmpPromise = this._invariants[i](data, selectedFields, options)
                        if (!(tmpPromise && tmpPromise.then)) {
                            // We didn't get a promise so this validation was synchronous
                            var tmpError = tmpPromise
                            tmpError && this._addInvariantError(formErrors, tmpError)
                            validationPromises.push(Promise.resolve(formErrors))
                        } else {
                            var _this = this
                            validationPromises.push(tmpPromise.then(function (tmpError) {
                                tmpError && _this._addInvariantError(formErrors, tmpError)
                                return Promise.resolve(formErrors)
                            }))
                        }
                    }
                } catch (e) {
                    console.error('[Schema] Invariant validation error for: ' + key)
                    console.log(data[key])
                    throw e
                }
            }
    
        }
    
        if (!async) {
            // Return error object if any found, else return undefined
            if (typeof formErrors.fieldErrors === "undefined" && typeof formErrors.invariantErrors === "undefined") {
                return undefined
            } else {
                return formErrors
            }
        } else {
            // Return a promise with the formErrors object
            return Promise.all(validationPromises)
                .then(function (results) {
                    // TODO: Right now we are basically return multiple promises with the same result so we only need to
                    // look at the first item. Should probably clean this up so we only return a single promise, but for now...
                    var formErrors = results[0]
                    if (formErrors === undefined || formErrors.fieldErrors === undefined && formErrors.invariantErrors === undefined) {
                        return Promise.resolve(undefined)
                    } else {
                        return Promise.resolve(formErrors)
                    }
                })
        }
    }

    /**
     * Adds props as defined in schema to passed object in place. Uses Object.defineProperty.
     * @param {Object} obj – the object to decorate
     */
    addProperties(obj) {
        var schema = this

        
        var fields = (schema && schema._fields) || []
        for (var key in fields) {
            var field = fields[key]
            Object.defineProperty(obj, key, {
                configurable: true, // We might want to remove properties when passing data through API
                enumerable: true,
                // Changed so props are allways writable, otherwise you can have problems creating the object
                // programmtically. Thus field.readOnly is only a form related property
                // writable: !field.readOnly
                writable: true
            })
        }
    }

    /**
     * Returns fields defined for this schema
     * @returns {Object} object containing fields
     */
    getFields() {
        return this._fields
    }
    
    /**
     * Recursively transforms form data. Normally used to convert input data from a browser form. Calls
     * .fromString on each field in schema in order to allow data to be cleaned and typed as specified
     * for each field type.
     * @param {Object} data – input object of any type, usually form data from browser
     * @param {Object} options – options object
     * @param {(string|string[])} options.selected – only include selected fields (comma separated list, or array, of prop names)
     * @param {(string|string[])} options.omitted – omit omitted fields (comma separated list, or array, of prop names)
     * @param {string[]} options.objectPath – path to input object, used when transforming nested object
     * @param {boolean} options.doNotRemoveReadOnly – standard behaviour is to remove readOnly props. This overrides
     * @returns {Object} returns the transformed object
     */
    transform(data, options = {}) {
        const { selectedFields: selected, omittedFields: omitted, objectPath = [], doNotRemoveReadOnly  } = options
        const { selectedFields, newFieldOptions } = this._getSelectedFieldsList(selected, omitted, objectPath)
        var outp = {}
        for (var i in selectedFields) {
            var key = selectedFields[i]
            newFieldOptions['objectPath'] = objectPath.concat(key)
            try {
                if (!this._fields[key].readOnly || doNotRemoveReadOnly) {
                    outp[key] = this._fields[key].fromString(data[key], Object.assign(options, newFieldOptions))
                }
            } catch (err) {
                // TODO: Error handling
                console.warn(err)
            }
        }
        return outp
    }
    

}

export default Schema
