
import { describe, expect, it } from "@jest/globals";
import EmailField from '../../src/field_validators/EmailField'

describe('Email field', function() {
    it('accepts valid e-mail', function() {        
        var theField = new EmailField({required: true});
    
        var tmp = theField.validate("valid@email.com");
        expect(tmp).toBe(undefined);
    });

    it('throws error if e-mail does not contain @', function() {        
        var theField = new EmailField({required: true});
        var tmp = theField.validate("email--email.com");
        expect(tmp).not.toBe(undefined);
    });

    it('throws error if e-mail has funky domain name', function() {        
        var theField = new EmailField({required: true});
        var tmp = theField.validate("email@email-com");
        expect(tmp).not.toBe(undefined);
    });
});
