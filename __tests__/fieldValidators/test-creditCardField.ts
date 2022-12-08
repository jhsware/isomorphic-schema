
import { describe, expect, it } from "@jest/globals";
import {CreditCardField} from '../../src'

describe('Credit Card field', function() {
    it('accepts valid Visa card', async function() {        
        var theField = new CreditCardField({required: true});
    
        var tmp = await theField.validate("4242 4242 4242 4242");
        expect(tmp).toBe(undefined);
    });
    
    it('accepts valid Mastercard', async function() {        
        var theField = new CreditCardField({required: true});
    
        var tmp = await theField.validate("5555 5555 5555 4444");
        expect(tmp).toBe(undefined);
    });
    
    it('accepts valid Amex', async function() {        
        var theField = new CreditCardField({required: true});
    
        var tmp = await theField.validate("3782 822463 10005");
        expect(tmp).toBe(undefined);
    });

    it('throws error if number is wrong', async function() {        
        var theField = new CreditCardField({required: true});
        var tmp = await theField.validate("0000 4242 4242 0000");
        expect(tmp).not.toBe(undefined);
    });

    it('throws error if number is too short', async function() {        
        var theField = new CreditCardField({required: true});
        var tmp = await theField.validate("0000 0000");
        expect(tmp).not.toBe(undefined);
    });
});
