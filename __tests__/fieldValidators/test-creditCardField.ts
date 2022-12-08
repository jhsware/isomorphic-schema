
import { describe, expect, it } from "@jest/globals";
import CreditCardField from '../../src/field_validators/CreditCardField'

describe('Credit Card field', function() {
    it('accepts valid Visa card', function() {        
        var theField = new CreditCardField({required: true});
    
        var tmp = theField.validate("4242 4242 4242 4242");
        expect(tmp).toBe(undefined);
    });
    
    it('accepts valid Mastercard', function() {        
        var theField = new CreditCardField({required: true});
    
        var tmp = theField.validate("5555 5555 5555 4444");
        expect(tmp).toBe(undefined);
    });
    
    it('accepts valid Amex', function() {        
        var theField = new CreditCardField({required: true});
    
        var tmp = theField.validate("3782 822463 10005");
        expect(tmp).toBe(undefined);
    });

    it('throws error if number is wrong', function() {        
        var theField = new CreditCardField({required: true});
        var tmp = theField.validate("0000 4242 4242 0000");
        expect(tmp).not.toBe(undefined);
    });

    it('throws error if number is too short', function() {        
        var theField = new CreditCardField({required: true});
        var tmp = theField.validate("0000 0000");
        expect(tmp).not.toBe(undefined);
    });
});
