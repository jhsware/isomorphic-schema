
import { describe, expect, it } from "@jest/globals";
import {EmailField} from '../../src/field_validators/EmailField'

describe('Email field', function() {
    it('accepts valid e-mail', async function() {        
        var theField = new EmailField({required: true});
    
        var tmp = await await theField.validate("valid@email.com");
        expect(tmp).toBe(undefined);
    });

    it('throws error if e-mail does not contain @', async function() {        
        var theField = new EmailField({required: true});
        var tmp = await await theField.validate("email--email.com");
        expect(tmp).not.toBe(undefined);
    });

    it('throws error if e-mail has funky domain name', async function() {        
        var theField = new EmailField({required: true});
        var tmp = await await theField.validate("email@email-com");
        expect(tmp).not.toBe(undefined);
    });
});
