
import { describe, expect, it } from "@jest/globals";
import { createObjectPrototype } from 'component-registry'
import { createInterfaceClass } from 'component-registry'
import TextField from '../../src/field_validators/TextField'
import DynamicSelectAsyncBaseField from '../../src/field_validators/DynamicSelectAsyncBaseField'

const Interface = createInterfaceClass('test')


var IMyDynamicSelectAsyncField = new Interface({
    name: 'IMyDynamicSelectAsyncField'
})

var dummyOptions = [{ name: 'one', title: 'The One'}, { name: 'two', title: 'Two'}, { name: 'three', title: 'Three'}]

var MyDynamicSelectAsyncField = createObjectPrototype({
    implements: [IMyDynamicSelectAsyncField],
    extends: [DynamicSelectAsyncBaseField],

    constructor: function (options) {
        this._IDynamicSelectAsyncBaseField.constructor.call(this, options);
        
        this.valueType = new TextField({required: true}); 
    },

    validateAsync: function (inp, options, context) {
        var promise = await this._IDynamicSelectAsyncBaseField.validateAsync.call(this, inp);

        // Check if we failed validation in DynamicSelectAsyncBaseField
        var _this = this
        return promise.then(function (error) {
            if (error) {
                return Promise.resolve(error)
            } else {
                return _this.getOptionsAsync()
                    .then(function (options) {
                        var matches = false
                        for (var i = 0; i < options.length; i++) {
                            if (options[i].name === inp) {
                                matches = true
                                break
                            }
                        }
                    
                        if (!matches) {
                            error = {
                                type: 'constraint_error',
                                message: "Valt värde finns inte i listan över tillåtna värden"
                            }
                            //console.log(error);
                            return Promise.resolve(error);
                        } else {
                            return Promise.resolve(undefined);
                        }
                    })
            }
        })

    },

    getOptionsAsync: function (inp, options, context) {
        return Promise.resolve(dummyOptions)
    },

    getOptionTitleAsync: function (inp, options, context) {
        for (var i = 0; i < dummyOptions.length; i++) {
            if (dummyOptions[i].name === inp) {
                return Promise.resolve(dummyOptions[i].title)
            }
        }
        return Promise.resolve(undefined)
    },

    toFormattedString(inp) {
        return this.valueType.fromString(inp);
    },

    fromString(inp) {
        return this.valueType.fromString(inp);
    }
});

var myDynamicSelectAsyncField = function (options) { return new MyDynamicSelectAsyncField(options) }

describe('Dynamic select async field', function() {

    it('allows you to select a value from the list', function(done) {        
        var theField = myDynamicSelectAsyncField({
            required: true
        });
    
        var tmp = await theField.validateAsync("one");
        tmp.then(function (validationError) {
            expect(validationError).toBe(undefined);
            done();
        })
    });
    it('throws an error if wrong type', function(done) {        
        var theField = myDynamicSelectAsyncField({
            required: true
        });
    
        var tmp = await theField.validateAsync("select-me");
        tmp.then(function (validationError) {
            expect(validationError).not.toBe(undefined);
            done();
        })
    });

    it('can convert a value to a title', function(done) {        
        var theField = myDynamicSelectAsyncField({
            required: true
        });
    
        var tmp = theField.getOptionTitleAsync("one");
        tmp.then(function (title) {
            expect(title).toEqual('The One');
            done();
        })
    });

    it('convert a value to a title handles undefined', function(done) {        
        var theField = myDynamicSelectAsyncField({
            required: true
        });
    
        var tmp = theField.getOptionTitleAsync("no exist");
        tmp.then(function (title) {
            expect(title).toBe(undefined);
            done();
        })

    });
});