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

import { BaseField } from "./field_validators";

type TValidationOptions = {
  skipInvariants: boolean;
  selectFields: string[],
  omitFields: string[],
  objectPath: string[],
}

type TTransformOptions = {
  selectFields: string[],
  omitFields: string[],
  objectPath: string[],
  doNotRemoveReadOnly: boolean,
}

type TInvariantValidator<T> = (data: T, selectedFields: string[], options: TValidationOptions) => Promise<boolean>;

type TSchemaOpts = {
  name: string,
  fields: Record<string, BaseField>, // TODO: any -> field type
  extend?: Schema[]
}

type TFieldErrorType = 'required' | 'value_error' | 'type_error';
export type TFieldError = {
  type: TFieldErrorType,
  i18nLabel: string,
  message: string
}

export type TInvariantErrorType = {
  message: string,
  fields: string[]
}

type TFormErrors = {
  fieldErrors: Record<string, TFieldError>,
  invariantErrors: TInvariantErrorType[]
}

export default class Schema {
  _fields;
  _name: string;
  _invariants: TInvariantValidator<any>[];
  _validationConstraints;


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
   * @param opts.schemaName – name of schema
   * @param opts.fields – schema fields
   * @param opts.extends – list of schemas to extend for composition (experimental)
   */
  constructor({ name, fields, extend = undefined }: TSchemaOpts) {

    this._name = name;
    this._fields = {};
    this._invariants = [];
    this._validationConstraints = [];

    // Check if we are extending other schemas
    if (Array.isArray(extend)) {
      // Fields in schemas to the right will override those to the left
      for (const schema of extend.reverse()) {
        const { _fields, _invariants, _validationConstraints } = schema;
        this._fields = { ..._fields, ...this._fields };
        this._invariants = { ..._invariants, ...this._invariants };
        this._validationConstraints = { ..._validationConstraints, ...this._validationConstraints };
      }
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
  addInvariant<T>(invariantValidator: TInvariantValidator<T>) {
    // TODO: Check that it is valid
    this._invariants.push(invariantValidator);
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
    this._validationConstraints.push(constraint);
  }

  _addFieldError(formErrors, propName, error) {
    formErrors.fieldErrors ??= {};
    formErrors.fieldErrors[propName] = error;
  }

  _addInvariantError(formErrors, error) {
    formErrors.invariantErrors ??= [];
    formErrors.invariantErrors.push(error);
  }

  _getSelectedFieldsList(selected, omitted, objectPath) {
    const namespace = objectPath.join('.');
    const selectedFields = [];

    for (var key in this._fields) {
      const dottedName = namespace ? `${namespace}.${key}` : key;

      if (selected.indexOf(dottedName) >= 0) {
        // This field has been selected
        if (omitted.indexOf(dottedName) < 0) {
          // And not omitted
          selectedFields.push(key);
        }
      }
    }

    // Remove root level props so they aren't counted when we pass on to next level
    // so we can select all if none are passed
    selected = selected.filter((key) => key.indexOf('.') >= 0);

    return selectedFields;
  }

  /**
   * Validate data async using defined schema. Allways returns a promise
   * @param data – the data input to be validated
   * @param options.selected – only include selected fields
   * @param options.omitted – omit omitted fields
   * @param options.objectPath – path to input object, used when transforming nested object
   * @param context – the entire data object which can be used by a field for conditional validation against other props
   */


  async validate<T>(
    data: T,
    options: TValidationOptions = {
      skipInvariants: false, selectFields: [], omitFields: [], objectPath: []
    },
    context: any = undefined
  ): Promise<TFormErrors | undefined> {
    const { skipInvariants, selectFields, omitFields, objectPath } = options;
    // We are making the validation stateless to avoid contaminating schemas
    // that are now used as a way to define the object model
    var formErrors = {
      fieldErrors: undefined,
      invariantErrors: undefined
    }

    const selectedFields =
      this._getSelectedFieldsList(selectFields, omitFields, objectPath);

    var validationPromises = []
    // Validate selected fields
    for (const key of selectedFields) {
      // Make sure we have a new options object...
      // Remove the selectedFields if passed because we don't want them to be sent to next validate function
      const { selectFields, ...newOptions } = options;
      // ...so we can add objectPath to determine where we are
      newOptions.objectPath = [...objectPath, key];

      // console.log("[Schema] validating: " + newOptions.objectPath.join("."))

      try {
        // Check validation constraints
        var failedValidators = this._validationConstraints.filter(function (constraint) {
          return !constraint(data, key, options);
        })
        // Only validate if we pass all the validation constraints
        if (failedValidators.length === 0) {
          if (!this._fields[key].readOnly) {

            var tmpPromise = this._fields[key].validateAsync(data[key], newOptions, context || data);
            if (!(tmpPromise && tmpPromise.then)) {
              // We didn't get a promise so this validation was synchronous
              var tmpError = tmpPromise;
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
              })(formErrors, key);
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
      for (const invariant of this._invariants) {
        try {
          const tmpPromise = invariant(data, selectFields, options);
          validationPromises.push(tmpPromise.then((tmpError) => {
            tmpError && this._addInvariantError(formErrors, tmpError);
            return formErrors;
          }))

        } catch (e) {
          throw e;
        }
      }

    }


    // Return a promise with the formErrors object
    return await Promise.all(validationPromises)
      .then(function (results) {
        // TODO: Right now we are basically return multiple promises with the same result so we only need to
        // look at the first item. Should probably clean this up so we only return a single promise, but for now...
        var formErrors = results[0];
        if (formErrors?.fieldErrors === undefined && formErrors?.invariantErrors === undefined) {
          return Promise.resolve(undefined);
        } else {
          return Promise.resolve(formErrors);
        }
      })
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
  transform<T>(data: T, options: TTransformOptions = {
    selectFields: [],
    omitFields: [],
    objectPath: [],
    doNotRemoveReadOnly: false,
  }) {
    let { selectFields, omitFields, objectPath = [], doNotRemoveReadOnly } = options
    const selectedFields = this._getSelectedFieldsList(selectFields, omitFields, objectPath)
    var outp = {}
    for (const key of selectedFields) {
      objectPath = [...objectPath, key]
      const _field = this._fields[key];
      try {
        if (!_field.readOnly || doNotRemoveReadOnly) {
          outp[key] = _field.fromString(data[key], { ...options, objectPath })
        }
      } catch (err) {
        // TODO: Error handling
        console.warn(err)
      }
    }
    return outp
  }


}

