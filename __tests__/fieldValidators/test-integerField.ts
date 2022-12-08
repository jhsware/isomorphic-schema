
import { describe, expect, it } from "@jest/globals";
import {IntegerField} from '../../src/field_validators/IntegerField'

describe('Integer field', function() {
    it('accepts non decimal numbers', async function() {        
        var integerField = new IntegerField({required: true});
    
        var tmp = await integerField.validate(6);
        expect(tmp).toBe(undefined);
    });
    
    it('accepts decimal numbers without fractions', async function() {        
        var integerField = new IntegerField({required: true});
    
        var tmp = await integerField.validate(13.0);
        expect(tmp).toBe(undefined);
    });
    
    it('accepts null as empty if field not required', async function() {        
        var integerField = new IntegerField({required: false});
    
        var tmp = await integerField.validate(null);
        expect(tmp).toBe(undefined);
    });
    
    it('converts string input properly with leading charaters and decimal', async function() {        
        var integerField = new IntegerField({required: true});
    
        var tmp = await integerField.fromString("ab12.0");
        expect(tmp).toBe(12);
    });
    
    it('renders null and undefined as empty string', async function() {        
        var integerField = new IntegerField({required: false});
    
        var tmp = await integerField.toFormattedString(undefined);
        expect(tmp).toBe('');
        var tmp = await integerField.toFormattedString(null);
        expect(tmp).toBe('');
    });
    
    it('does not convert integer input', async function() {        
        var integerField = new IntegerField({required: true});
    
        var tmp = await integerField.fromString(12);
        expect(tmp).toBe(12);
    });

    it('throws error on undefined if required', async function() {        
        var integerField = new IntegerField({required: true});
        var tmp = await integerField.validate(undefined);
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error on null if required', async function() {        
        var integerField = new IntegerField({required: true});
        var tmp = await integerField.validate(null);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error when passed a string', async function() {        
        var integerField = new IntegerField({required: false});
        var tmp = await integerField.validate("4");
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error when passed a float', async function() {        
        var integerField = new IntegerField({required: false});
        var tmp = await integerField.validate(6.4);
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error if smaller than minimum', async function() {        
        var integerField = new IntegerField({required: true, min: 1});
        var tmp = await integerField.validate(0);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error if larger than maximum', async function() {        
        var integerField = new IntegerField({required: true, max: 10});
        var tmp = await integerField.validate(11);
        expect(tmp).not.toBe(undefined);
    });

    
});
