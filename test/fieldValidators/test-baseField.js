var assert = require('assert');
var expect = require('expect.js');

var validators = require('../../lib/field_validators');
var Schema = require('../../lib/schema');

describe('Base field', function() {
    it('supports required', function() {        
        var baseField = validators.baseField({required: true});
    
        var tmp = baseField.validate();
        expect(tmp).to.not.be(undefined);
        
        var tmp = baseField.validate('something');
        expect(tmp).to.be(undefined);
    });
    
    it('shows error on required test if null', function() {        
        var baseField = validators.baseField({required: true});
    
        var tmp = baseField.validate(null);
        expect(tmp).to.not.be(undefined);
        
        var tmp = baseField.validate('something');
        expect(tmp).to.be(undefined);
    });

    it('supports being optional', function() {        
        var baseField = validators.baseField({required: false});
        var tmp = baseField.validate();
        expect(tmp).to.be(undefined);

        var baseField = validators.baseField();
        var tmp = baseField.validate();
        expect(tmp).to.be(undefined);
    });
});