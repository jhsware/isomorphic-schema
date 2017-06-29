var assert = require('assert');
var expect = require('expect.js');

var DecimalField = require('../../lib/field_validators/DecimalField');
var Schema = require('../../lib/schema');

describe('Decimal field', function() {
    it('accepts non decimal numbers', function() {        
        var integerField = new DecimalField({required: true});
    
        var tmp = integerField.validate(6);
        expect(tmp).to.be.undefined;
    });
    
    it('accepts decimal numbers', function() {        
        var integerField = new DecimalField({required: true});
    
        var tmp = integerField.validate(6.0);
        expect(tmp).to.be.undefined;
    });
    
    it('accepts decimal numbers with fractions', function() {        
        var integerField = new DecimalField({required: true});
    
        var tmp = integerField.validate(13.3);
        expect(tmp).to.be.undefined;
    });
    
    it('accepts null as empty if field not required', function() {        
        var integerField = new DecimalField({required: false});
    
        var tmp = integerField.validate(null);
        expect(tmp).to.be.undefined;
    });
    
    it('converts string input properly with leading charaters and decimal', function() {        
        var integerField = new DecimalField({required: true});
    
        var tmp = integerField.fromString("ab12.5");
        expect(tmp).to.be(12.5);
    });
    
    it('does not change decimal input', function() {        
        var integerField = new DecimalField({required: true});
    
        var tmp = integerField.fromString(12.5);
        expect(tmp).to.be(12.5);
    });
    
    it('returns undefined if empty', function() {        
        var integerField = new DecimalField({required: true});
    
        var tmp = integerField.fromString(12.5);
        expect(tmp).to.be(12.5);
    });
    
    it('renders undefined and null as the value they are when field has precision', function() {        
        var integerField = new DecimalField({required: false, precision: 2});
    
        var tmp = integerField.toFormattedString(undefined);
        expect(tmp).to.be.undefined;
        var tmp = integerField.toFormattedString(null);
        expect(tmp).to.be.null;
    });
    
    it('returns empty string as undefined', function() {        
        var integerField = new DecimalField({required: true});
    
        var tmp = integerField.fromString('');
        expect(tmp).to.be.undefined;
    });
    

    it('throws error on undefined if required', function() {        
        var integerField = new DecimalField({required: true});
        var tmp = integerField.validate();
        expect(tmp).to.not.be(undefined);
    });
    
    it('throws error on null if required', function() {        
        var integerField = new DecimalField({required: true});
        var tmp = integerField.validate(null);
        expect(tmp).to.not.be(undefined);
    });

    it('throws error when passed a string', function() {        
        var integerField = new DecimalField({required: false});
        var tmp = integerField.validate("4.05");
        expect(tmp).to.not.be(undefined);
    });
    
    it('throws error if smaller than minimum', function() {        
        var integerField = new DecimalField({required: true, min: 1});
        var tmp = integerField.validate(0.99);
        expect(tmp).to.not.be(undefined);
    });

    it('throws error if larger than maximum', function() {        
        var integerField = new DecimalField({required: true, max: 10});
        var tmp = integerField.validate(11.6);
        expect(tmp).to.not.be(undefined);
    });
    
    it('renders correct number of decimals', function() {        
        var integerField = new DecimalField({required: true, precision: 2});
        var tmp = integerField.toFormattedString(11.123);
        expect(tmp).to.be('11.12');
    });
    
    it('rounds to precision', function() {        
        var integerField = new DecimalField({required: true, precision: 2});
        var tmp = integerField.fromString("11.123");
        expect(tmp).to.be(11.12);
    });

    
});