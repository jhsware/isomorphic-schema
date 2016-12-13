var assert = require('assert');
var expect = require('expect.js');

var createObjectPrototype = require('component-registry').createObjectPrototype
var createInterface = require('component-registry').createInterface

var validators = require('../../lib/field_validators');
var DynamicSelectBaseField = require('../../lib').fieldObjectPrototypes.DynamicSelectBaseField;

var IMyDynamicSelectField = createInterface({
    name: 'IMyDynamicSelectField'
})

var dummyOptions = [{ name: 'one', title: 'The One'}, { name: 'two', title: 'Two'}, { name: 'three', title: 'Three'}]

var MyDynamicSelectField = createObjectPrototype({
    implements: [IMyDynamicSelectField],
    extends: [DynamicSelectBaseField],

    constructor: function (options) {
        this._IDynamicSelectBaseField.constructor.call(this, options);
        
        this.valueType = validators.textField({required: true}); 
        
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
            valueType: validators.textField({required: true})
        });
    
        var tmp = theField.validate("one");
        expect(tmp).to.be(undefined);
    });
    
    it('allows undefined or null if not required', function() {        
        var theField = myDynamicSelectField({
            required: false,
            valueType: validators.textField({required: true})
        });
    
        var tmp = theField.validate(undefined);
        expect(tmp).to.be(undefined);
        var tmp = theField.validate(null);
        expect(tmp).to.be(undefined);
    });

    it('throws an error if selected value is outside list', function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: validators.textField({required: true})
        });
    
        var tmp = theField.validate("outside-list");
        expect(tmp).to.not.be(undefined);
    });

    it('throws an error if wrong type', function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: validators.integerField({required: true})
        });
    
        var tmp = theField.validate("select-me");
        expect(tmp).to.not.be(undefined);
    });

    it('can convert a value to a title', function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: validators.textField({required: true})
        });
    
        var tmp = theField.getOptionTitle("one");
        expect(tmp).to.equal('The One');
    });

    it('convert a value to a title handles undefined', function() {        
        var theField = myDynamicSelectField({
            required: true,
            valueType: validators.textField({required: true})
        });
    
        var tmp = theField.getOptionTitle("no exist");
        expect(tmp).to.be(undefined);
    });

});