
import { describe, expect, it } from "@jest/globals";
import {TelephoneField} from '../../src'

describe('Telephone field', function() {
    it('accepts international phonenumber', async function() {        
        var phoneField = new TelephoneField({required: true});
    
        var tmp = await phoneField.validate("+46 707 555 555");
        expect(tmp).toBe(undefined);
    });

    it('accepts local phonenumber', async function() {        
        var phoneField = new TelephoneField({required: true});
    
        var tmp = await phoneField.validate("0707-55 55 55");
        expect(tmp).toBe(undefined);
    });

    it('throws error on undefined if required', async function() {        
        var phoneField = new TelephoneField({required: true});
        var tmp = await phoneField.validate(undefined);
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error on malformed phonenumber', async function() {        
        var phoneField = new TelephoneField({required: false});
        var tmp = await phoneField.validate("+4567$707 555 555");
        expect(tmp).not.toBe(undefined);
    });

    it('throws error on malformed phonenumber when called twice', async function() {
        var inp = "+4567$707 555 555"
        var phoneField = new TelephoneField({required: false});
        var tmp = await phoneField.validate(inp);
        expect(tmp).not.toBe(undefined);
        var tmp = await phoneField.validate(inp);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error on too many characters', async function() {        
        var phoneField = new TelephoneField({required: false});
        var tmp = await phoneField.validate("1234567890123456");
        expect(tmp).not.toBe(undefined);
    });
});