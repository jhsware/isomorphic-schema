var assert = require('assert');
var expect = require('expect.js');

var BaseField = require('../../lib/field_validators/BaseField');
var Schema = require('../../lib/schema');

describe('Base field', function() {
    it('supports required', function() {        
        var baseField = new BaseField({required: true});
    
        var tmp = baseField.validate();
        expect(tmp).to.not.be(undefined);
        
        var tmp = baseField.validate('something');
        expect(tmp).to.be(undefined);
    });
    
    it('shows error on required test if null', function() {        
        var baseField = new BaseField({required: true});
    
        var tmp = baseField.validate(null);
        expect(tmp).to.not.be(undefined);
        
        var tmp = baseField.validate('something');
        expect(tmp).to.be(undefined);
    });

    it('supports being optional', function() {        
        var baseField = new BaseField({required: false});
        var tmp = baseField.validate();
        expect(tmp).to.be(undefined);

        var baseField = new BaseField();
        var tmp = baseField.validate();
        expect(tmp).to.be(undefined);
    });
});