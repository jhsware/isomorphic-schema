var assert = require('assert');
var expect = require('expect.js');

var validators = require('../../lib/field_validators');
var Schema = require('../../lib/schema');

// TODO: Write async tests

describe('Any of', function() {
    it('handles undefined when not required', function() {        
        var anyOf = validators.anyOf({
            valueTypes: [
                validators.textField({ required: true })
            ]
        });
    
        var tmp = anyOf.validate(undefined);
        expect(tmp).to.be(undefined);
    });

    it('throws error on undefined when required', function() {
        var anyOf = validators.anyOf({
            required: true,
            valueTypes: [
                validators.textField({})
            ]
        });
    
        var tmp = anyOf.validate(undefined);
        expect(tmp).not.to.be(undefined);
    });

    it('throws error if no value type validates', function() {
        var anyOf = validators.anyOf({
            required: true,
            valueTypes: [
                validators.integerField({})
            ]
        });
    
        var tmp = anyOf.validate("not a number");
        expect(tmp).not.to.be(undefined);
    });

    it('is ok if at least one value type validates', function() {
        var anyOf = validators.anyOf({
            required: true,
            valueTypes: [
                validators.integerField({}),
                validators.textField({})
            ]
        });
    
        var tmp = anyOf.validate("not a number");
        expect(tmp).to.be(undefined);
    });
});