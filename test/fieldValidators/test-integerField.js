
import expect from 'expect.js'

import IntegerField from '../../src/field_validators/IntegerField'
import Schema from '../../src/schema'

describe('Integer field', function() {
    it('accepts non decimal numbers', function() {        
        var integerField = new IntegerField({required: true});
    
        var tmp = integerField.validate(6);
        expect(tmp).to.be(undefined);
    });
    
    it('accepts decimal numbers without fractions', function() {        
        var integerField = new IntegerField({required: true});
    
        var tmp = integerField.validate(13.0);
        expect(tmp).to.be(undefined);
    });
    
    it('accepts null as empty if field not required', function() {        
        var integerField = new IntegerField({required: false});
    
        var tmp = integerField.validate(null);
        expect(tmp).to.be(undefined);
    });
    
    it('converts string input properly with leading charaters and decimal', function() {        
        var integerField = new IntegerField({required: true});
    
        var tmp = integerField.fromString("ab12.0");
        expect(tmp).to.be(12);
    });
    
    it('renders null and undefined as empty string', function() {        
        var integerField = new IntegerField({requried: false});
    
        var tmp = integerField.toFormattedString(undefined);
        expect(tmp).to.be('');
        var tmp = integerField.toFormattedString(null);
        expect(tmp).to.be('');
    });
    
    it('does not convert integer input', function() {        
        var integerField = new IntegerField({required: true});
    
        var tmp = integerField.fromString(12);
        expect(tmp).to.be(12);
    });

    it('throws error on undefined if required', function() {        
        var integerField = new IntegerField({required: true});
        var tmp = integerField.validate();
        expect(tmp).to.not.be(undefined);
    });
    
    it('throws error on null if required', function() {        
        var integerField = new IntegerField({required: true});
        var tmp = integerField.validate(null);
        expect(tmp).to.not.be(undefined);
    });

    it('throws error when passed a string', function() {        
        var integerField = new IntegerField({required: false});
        var tmp = integerField.validate("4");
        expect(tmp).to.not.be(undefined);
    });
    
    it('throws error when passed a float', function() {        
        var integerField = new IntegerField({required: false});
        var tmp = integerField.validate(6.4);
        expect(tmp).to.not.be(undefined);
    });
    
    it('throws error if smaller than minimum', function() {        
        var integerField = new IntegerField({required: true, min: 1});
        var tmp = integerField.validate(0);
        expect(tmp).to.not.be(undefined);
    });

    it('throws error if larger than maximum', function() {        
        var integerField = new IntegerField({required: true, max: 10});
        var tmp = integerField.validate(11);
        expect(tmp).to.not.be(undefined);
    });

    
});
