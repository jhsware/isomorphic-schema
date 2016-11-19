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
var clone = require('./utils').clone;

var Schema = function (opts, fieldDefs) {
    if (typeof opts === 'string') {
        // Backward compatibility
        var schemaName = opts;
    } else {
        var schemaName = opts.schemaName;
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
        // Left most overrides those to the right
        opts.extends.reverse();
        opts.extends.map(function (schema) {
            for (var key in schema._fields) {
                this._fields[key] = schema._fields[key];
            }
            for (var key in schema._invariants) {
                this._invariants[key] = schema._invariants[key];
            }
            for (var key in schema._validationConstraints) {
                this._validationConstraints[key] = schema._validationConstraints[key];
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

Schema.prototype.validate = function (data, options) {    
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
    
    // Validate selected fields
    for (var i in selectedFields) {
        var key = selectedFields[i];
        
        // Make sure we have a new options object...
        if (!options) {
            var newOptions = {};
        } else {
            var newOptions = clone(options);
        };
        
        // ...so we can add objectPath for easier debugging
        if (newOptions.objectPath) {
            newOptions.objectPath.push(key);
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
                    var tmpError = this._fields[key].validate(data[key], newOptions, data);
                    tmpError && this._addFieldError(formErrors, key, tmpError);
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
                var tmpError = this._invariants[i](data, selectedFields, options);
                tmpError && this._addInvariantError(formErrors, tmpError);
            } catch (e) {
                console.error('[Schema] Invariant validation error for: ' + key);
                console.log(data[key]);
                throw e;
            }
        }

    };

    // Return error object if any found, else return undefined
    if (typeof formErrors.fieldErrors === "undefined" && typeof formErrors.invariantErrors === "undefined") {
        return undefined;
    } else {
        return formErrors;
    };
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
