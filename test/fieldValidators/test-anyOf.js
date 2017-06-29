var assert = require('assert');
var expect = require('expect.js');

var AnyOf = require('../../lib/field_validators/AnyOf');
var TextField = require('../../lib/field_validators/TextField');
var IntegerField = require('../../lib/field_validators/IntegerField');
var Schema = require('../../lib/schema');

// TODO: Write async tests

describe('Any of', function() {
    it('handles undefined when not required', function() {        
        var anyOf = new AnyOf({
            valueTypes: [
                new TextField({ required: true })
            ]
        });
    
        var tmp = anyOf.validate(undefined);
        expect(tmp).to.be(undefined);
    });

    it('throws error on undefined when required', function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new TextField({})
            ]
        });
    
        var tmp = anyOf.validate(undefined);
        expect(tmp).not.to.be(undefined);
    });

    it('throws error if no value type validates', function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new IntegerField({})
            ]
        });
    
        var tmp = anyOf.validate("not a number");
        expect(tmp).not.to.be(undefined);
    });

    it('is ok if at least one value type validates (string)', function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new IntegerField({}),
                new TextField({})
            ]
        });
    
        var tmp = anyOf.validate("not a number");
        expect(tmp).to.be(undefined);
    });

    it('is ok if at least one value type validates (integer)', function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new IntegerField({})
            ]
        });
    
        var tmp = anyOf.validate("234");
        expect(tmp).to.be(undefined);
    });
});