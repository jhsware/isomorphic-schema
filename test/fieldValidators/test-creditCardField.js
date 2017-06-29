var assert = require('assert');
var expect = require('expect.js');

var CreditCardField = require('../../lib/field_validators/CreditCardField');
var Schema = require('../../lib/schema');

describe('Credit Card field', function() {
    it('accepts valid Visa card', function() {        
        var theField = new CreditCardField({required: true});
    
        var tmp = theField.validate("4242 4242 4242 4242");
        expect(tmp).to.be(undefined);
    });
    
    it('accepts valid Mastercard', function() {        
        var theField = new CreditCardField({required: true});
    
        var tmp = theField.validate("5555 5555 5555 4444");
        expect(tmp).to.be(undefined);
    });
    
    it('accepts valid Amex', function() {        
        var theField = new CreditCardField({required: true});
    
        var tmp = theField.validate("3782 822463 10005");
        expect(tmp).to.be(undefined);
    });

    it('throws error if number is wrong', function() {        
        var theField = new CreditCardField({required: true});
        var tmp = theField.validate("0000 4242 4242 0000");
        expect(tmp).to.not.be(undefined);
    });

    it('throws error if number is too short', function() {        
        var theField = new CreditCardField({required: true});
        var tmp = theField.validate("0000 0000");
        expect(tmp).to.not.be(undefined);
    });
});
