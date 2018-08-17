'use strict';

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

var cloneShallow = require('./utils').cloneShallow;

var Schema = function (opts, fieldDefs) {
    if (typeof opts === 'string') {
        // Backward compatibility
        var schemaName = opts;
    } else {
        var schemaName = opts.schemaName;
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
    };
    
    this._name = schemaName;
    this._fields = {};
    this._invariants = [];
    this._validationConstraints = [];

    // Check if we are extending other schemas
    if (Array.isArray(opts.extends)) {
        // Fields in schemas to the right will override those to the left
        opts.extends.map(function (schema) {
            for (var key in schema._fields) {
                this._fields[key] = schema._fields[key];
            }
            for (var key in schema._invariants) {
                this._invariants.push(schema._invariants[key]);
            }
            for (var key in schema._validationConstraints) {
                this._validationConstraints.push(schema._validationConstraints[key]);
            }
        }.bind(this));
    }
    
    for (var key in fieldDefs) {
        this._fields[key] = fieldDefs[key];
    }
};

Schema.prototype.addInvariant = function (invariant) {
    // TODO: Check that it is valid
    this._invariants.push(invariant);
};

Schema.prototype.addValidationConstraint = function (constraint) {
    // TODO: Check that it is valid
    this._validationConstraints.push(constraint);
};

Schema.prototype._addFieldError = function (formErrors, propName, error) {
    if (typeof formErrors.fieldErrors === "undefined") {
        formErrors.fieldErrors = {};
    }
    formErrors.fieldErrors[propName] = error;
};

Schema.prototype._addInvariantError = function (formErrors, error) {
    if (typeof formErrors.invariantErrors === "undefined") {
        formErrors.invariantErrors = [];
    }
    formErrors.invariantErrors.push(error);
};

Schema.prototype._getSelectedFieldsList = function (selectedFields) {
    if (typeof selectedFields === "string") {
        selectedFields = [selectedFields];
    }
    
    if (typeof selectedFields === 'undefined') {
        selectedFields = []
        for (var key in this._fields) {
            selectedFields.push(key);
        }
    }
    return selectedFields;
}

// TODO: validate async
Schema.prototype.validateAsync = function (data, options, context) {
    return this.validate(data, options, context || data, true)
}

Schema.prototype.validate = function (data, options, context, async) {    
    var skipInvariants = false,
        selectedFields = undefined;
    
    if (options) {
        skipInvariants = options.skipInvariants || false;
        selectedFields = options.selectedFields;
    }
    
    // We are making the validation stateless to avoid contaminating schemas
    // that are now used as a way to define the object model
    var formErrors = {
        fieldErrors: undefined,
        invariantErrors: undefined
    };
    
    
    selectedFields = this._getSelectedFieldsList(selectedFields);
    
    var validationPromises = []
    // Validate selected fields
    for (var i in selectedFields) {
        var key = selectedFields[i];
        
        // Make sure we have a new options object...
        if (!options) {
            var newOptions = {};
        } else {
            var newOptions = cloneShallow(options);
        };
        
        // ...so we can add objectPath to determine where we are
        if (Array.isArray(newOptions.objectPath)) {
            newOptions.objectPath = newOptions.objectPath.concat([key])
        } else {
            newOptions.objectPath = [key]
        }
        
        // Remove the selectedFields if passed because we don't want them to be sent to next validate function
        if (newOptions.selectedFields) {
            delete newOptions.selectedFields;
        }
        
        // console.log("[Schema] validating: " + newOptions.objectPath.join("."));
        
        try {
            
            // Check validation constraints
            var failedValidators = this._validationConstraints.filter(function (constraint) {
                return !constraint(data, key, options);
            });
            // Only validate if we pass all the validation constraints
            if (failedValidators.length === 0) {
                if (!this._fields[key].readOnly) {
                    if (!async) {
                        var tmpError = this._fields[key].validate(data[key], newOptions, context || data);
                        tmpError && this._addFieldError(formErrors, key, tmpError);
                    } else {
                        var tmpPromise = this._fields[key].validateAsync(data[key], newOptions, context || data)
                        if (!(tmpPromise && tmpPromise.then)) {
                            // We didn't get a promise so this validation was synchronous
                            var tmpError = tmpPromise
                            tmpError && this._addFieldError(formErrors, key, tmpError);
                            validationPromises.push(Promise.resolve(formErrors));
                            // Errors are added when promises are resolved at end of this function
                        } else {
                            var _this = this;
                            (function (formErrors, key) {
                                validationPromises.push(tmpPromise.then(function (tmpError) {
                                    tmpError && _this._addFieldError(formErrors, key, tmpError);
                                    return Promise.resolve(formErrors);
                                }))
                            })(formErrors, key)
                        }
                        
                    }
                }
            }            
        } catch (e) {
            console.error('[Schema] Field validation error for: ' + key);
            console.log(data && data[key]);
            throw e;
        }
    }
    
    if (!skipInvariants) {
    
        // Validate invariants
        for (var i = 0, imax = this._invariants.length; i < imax; i++) {
            try {
                if (!async) {
                    var tmpError = this._invariants[i](data, selectedFields, options);
                    tmpError && this._addInvariantError(formErrors, tmpError);
                } else {
                    var tmpPromise = this._invariants[i](data, selectedFields, options);
                    if (!(tmpPromise && tmpPromise.then)) {
                        // We didn't get a promise so this validation was synchronous
                        var tmpError = tmpPromise;
                        tmpError && this._addInvariantError(formErrors, tmpError);
                        validationPromises.push(Promise.resolve(formErrors));
                    } else {
                        var _this = this;
                        validationPromises.push(tmpPromise.then(function (tmpError) {
                            tmpError && _this._addInvariantError(formErrors, tmpError);
                            return Promise.resolve(formErrors);
                        }))
                    }
                }
            } catch (e) {
                console.error('[Schema] Invariant validation error for: ' + key);
                console.log(data[key]);
                throw e;
            }
        }

    };

    if (!async) {
        // Return error object if any found, else return undefined
        if (typeof formErrors.fieldErrors === "undefined" && typeof formErrors.invariantErrors === "undefined") {
            return undefined;
        } else {
            return formErrors;
        };
    } else {
        // Return a promise with the formErrors object
        return Promise.all(validationPromises)
            .then(function (results) {
                // TODO: Right now we are basically return multiple promises with the same result so we only need to
                // look at the first item. Should probably clean this up so we only return a single promise, but for now...
                var formErrors = results[0]
                if (formErrors === undefined || formErrors.fieldErrors === undefined && formErrors.invariantErrors === undefined) {
                    return Promise.resolve(undefined);
                } else {
                    return Promise.resolve(formErrors);
                }
            })
    }
};

Schema.prototype.transform = function (data, selectedFields, doNotRemoveReadOnly) {
    selectedFields = this._getSelectedFieldsList(selectedFields);
    var outp = {};
    for (var i in selectedFields) {
        var key = selectedFields[i];
        try {
            if (!this._fields[key].readOnly || doNotRemoveReadOnly) {
                outp[key] = this._fields[key].fromString(data[key], doNotRemoveReadOnly);
            }
        } catch (err) {
            // TODO: Error handling
            console.warn(err)
        }
    }
    return outp;
}

module.exports = Schema;
