
import { describe, expect, it } from "@jest/globals";
import { createObjectPrototype } from 'component-registry'
import { createInterfaceClass } from 'component-registry'
import TextField from '../../src/field_validators/TextField'
import IntegerField from '../../src/field_validators/IntegerField'
import DynamicSelectBaseField from '../../src/field_validators/DynamicSelectBaseField'

const Interface = createInterfaceClass('MyTestApp')

var IMyDynamicSelectField = new Interface({
    name: 'IMyDynamicSelectField'
})

var dummyOptions = [{ name: 'one', title: 'The One'}, { name: 'two', title: 'Two'}, { name: 'three', title: 'Three'}]

var MyDynamicSelectField = createObjectPrototype({
    implements: [IMyDynamicSelectField],
    extends: [DynamicSelectBaseField],

    constructor: function (options) {
        this._IDynamicSelectBaseField.constructor.call(this, options);
        
        this.valueType = new TextField({required: true}); 
        
    },

    getOptions: function (inp, options, context) {
        return dummyOptions
    },

    toFormattedString(inp) {
        return this.valueType.fromString(inp);
    },

    fromString(inp) {
        return this.valueType.fromString(inp);
    }
});

var myDynamicSelectField = function (options) { return new MyDynamicSelectField(options) }

describe('Dynamic select field', function() {

    it('allows you to select a value from the list', async function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: new TextField({required: true})
        });
    
        var tmp = await theField.validate("one");
        expect(tmp).toBe(undefined);
    });
    
    it('allows undefined or null if not required', async function() {        
        var theField = myDynamicSelectField({
            required: false,
            valueType: new TextField({required: true})
        });
    
        var tmp = await theField.validate(undefined);
        expect(tmp).toBe(undefined);
        var tmp = await theField.validate(null);
        expect(tmp).toBe(undefined);
    });

    it('throws an error if selected value is outside list', async function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: new TextField({required: true})
        });
    
        var tmp = await theField.validate("outside-list");
        expect(tmp).not.toBe(undefined);
    });

    it('throws an error if wrong type', async function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: new IntegerField({required: true})
        });
    
        var tmp = await theField.validate("select-me");
        expect(tmp).not.toBe(undefined);
    });

    it('can convert a value to a title', async function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: new TextField({required: true})
        });
    
        var tmp = theField.getOptionTitle("one");
        expect(tmp).toEqual('The One');
    });

    it('convert a value to a title handles undefined', async function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: new TextField({required: true})
        });
    
        var tmp = theField.getOptionTitle("no exist");
        expect(tmp).toBe(undefined);
    });

});