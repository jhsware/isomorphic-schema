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
var _ = require('lodash');

var Schema = function (schemaName, fieldDefs) {
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
    this._fields = fieldDefs;
    this._invariants = [];
    this._validationConstraints = [];
};

Schema.prototype.addInvariant = function (invariant) {
    // TODO: Check that it is valid
    this._invariants.push(invariant);
};

Schema.prototype.addValidationConstraint = function (constraint) {
    // TODO: Check that it is valid
    this._validationConstraints.push(constraint);
};

Schema.prototype._addFieldError = function (propName, error) {
    if (typeof this.field_errors === "undefined") {
        this.field_errors = {};
    }
    this.field_errors[propName] = error;
};

Schema.prototype._addInvariantError = function (error) {
    if (typeof this.invariant_errors === "undefined") {
        this.invariant_errors = [];
    }
    this.invariant_errors.push(error);
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
    
    this.field_errors = undefined;
    this.invariant_errors = undefined;
    
    
    selectedFields = this._getSelectedFieldsList(selectedFields);
    
    // Validate selected fields
    for (var i in selectedFields) {
        var key = selectedFields[i];
        
        // Make sure we have a new options object...
        if (!options) {
            var newOptions = {};
        } else {
            var newOptions = _.cloneDeep(options);
        };
        
        // ...so we can add objectPath for easier debugging
        if (newOptions.objectPath) {
            newOptions.objectPath.push(key);
        } else {
            newOptions.objectPath = [key]
        }
        
        // console.log("[Schema] validating: " + newOptions.objectPath.join("."));
        
        try {
            
            // Check validation constraints
            var failedValidators = this._validationConstraints.filter(function (constraint) {
                return !constraint(data, key);
            });
            // Only validate if we pass all the validation constraints
            if (failedValidators.length === 0) {
                var tmpError = this._fields[key].validate(data[key], newOptions);
                tmpError && this._addFieldError(key, tmpError);
            }            
        } catch (e) {
            console.error('[Schema] Field validation error for: ' + key);
            console.log(data[key]);
            throw e;
        }
    }
    
    if (skipInvariants) {
        return this.isValid();
    }
    
    // Validate invariants
    for (var i = 0, imax = this._invariants.length; i < imax; i++) {
        try {
            var tmpError = this._invariants[i](data, selectedFields);
            tmpError && this._addInvariantError(tmpError);
        } catch (e) {
            console.error('[Schema] Invariant validation error for: ' + key);
            console.log(data[key]);
            throw e;
        }
    }

    return this.isValid();
};

Schema.prototype.isValid = function (field_errors, invariant_errors) {
    var field_errors = field_errors || this.field_errors, 
        invariant_errors = invariant_errors || this.invariant_errors;
        
    return (typeof field_errors === "undefined" && typeof invariant_errors === "undefined");
};

Schema.prototype.convertFromString = function (data, selectedFields, options) {
    selectedFields = this._getSelectedFieldsList(selectedFields);
    for (var i in selectedFields) {
        var key = selectedFields[i];
        try {
            data.key = this._fields[key].convertFromString(data[key]);
        } catch (err) {
            // TODO: Error handling
        }
    }
    
}

module.exports = Schema;
