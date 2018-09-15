
import expect from 'expect.js'

import { createObjectPrototype } from 'component-registry'
import { createInterface } from 'component-registry'

import TextField from '../../src/field_validators/TextField'
import IntegerField from '../../src/field_validators/IntegerField'
import DynamicSelectBaseField from '../../src/field_validators/DynamicSelectBaseField'

var IMyDynamicSelectField = createInterface({
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

    toFormattedString: function (inp) {
        return this.valueType.fromString(inp);
    },

    fromString: function (inp) {
        return this.valueType.fromString(inp);
    }
});

var myDynamicSelectField = function (options) { return new MyDynamicSelectField(options) }

describe('Dynamic select field', function() {

    it('allows you to select a value from the list', function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: new TextField({required: true})
        });
    
        var tmp = theField.validate("one");
        expect(tmp).to.be(undefined);
    });
    
    it('allows undefined or null if not required', function() {        
        var theField = myDynamicSelectField({
            required: false,
            valueType: new TextField({required: true})
        });
    
        var tmp = theField.validate(undefined);
        expect(tmp).to.be(undefined);
        var tmp = theField.validate(null);
        expect(tmp).to.be(undefined);
    });

    it('throws an error if selected value is outside list', function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: new TextField({required: true})
        });
    
        var tmp = theField.validate("outside-list");
        expect(tmp).to.not.be(undefined);
    });

    it('throws an error if wrong type', function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: new IntegerField({required: true})
        });
    
        var tmp = theField.validate("select-me");
        expect(tmp).to.not.be(undefined);
    });

    it('can convert a value to a title', function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: new TextField({required: true})
        });
    
        var tmp = theField.getOptionTitle("one");
        expect(tmp).to.equal('The One');
    });

    it('convert a value to a title handles undefined', function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: new TextField({required: true})
        });
    
        var tmp = theField.getOptionTitle("no exist");
        expect(tmp).to.be(undefined);
    });

});