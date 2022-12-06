
import { describe, expect, it } from "@jest/globals";
import TelephoneField from '../../src/field_validators/TelephoneField'

describe('Telephone field', function() {
    it('accepts international phonenumber', function() {        
        var phoneField = new TelephoneField({required: true});
    
        var tmp = phoneField.validate("+46 707 555 555");
        expect(tmp).toBe(undefined);
    });

    it('accepts local phonenumber', function() {        
        var phoneField = new TelephoneField({required: true});
    
        var tmp = phoneField.validate("0707-55 55 55");
        expect(tmp).toBe(undefined);
    });

    it('throws error on undefined if required', function() {        
        var phoneField = new TelephoneField({required: true});
        var tmp = phoneField.validate();
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error on malformed phonenumber', function() {        
        var phoneField = new TelephoneField({required: false});
        var tmp = phoneField.validate("+4567$707 555 555");
        expect(tmp).not.toBe(undefined);
    });

    it('throws error on malformed phonenumber when called twice', function() {
        var inp = "+4567$707 555 555"
        var phoneField = new TelephoneField({required: false});
        var tmp = phoneField.validate(inp);
        expect(tmp).not.toBe(undefined);
        var tmp = phoneField.validate(inp);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error on too many characters', function() {        
        var phoneField = new TelephoneField({required: false});
        var tmp = phoneField.validate("1234567890123456");
        expect(tmp).not.toBe(undefined);
    });
});