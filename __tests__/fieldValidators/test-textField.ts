
import { describe, expect, it } from "@jest/globals";
import {TextField} from '../../src/field_validators/TextField'

describe('Text field', function() {
    it('accepts strings', async function() {        
        var textField = new TextField({required: true});
    
        var tmp = await await textField.validate("this is a sting");
        expect(tmp).toBe(undefined);
    });

    it('throws error on undefined if required', async function() {        
        var textField = new TextField({required: true});
        var tmp = await await textField.validate(undefined);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error on single space if required and trim is true', async function() {        
        var textField = new TextField({required: true, trim: true});
        var tmp = await await textField.validate(' ');
        expect(tmp).not.toBe(undefined);
    });

    it('trims spaces if trim is true', async function() {        
        var textField = new TextField({trim: true});
        var tmp = await textField.fromString(' a ');
        expect(tmp).toEqual('a');
    });

    it('throws error on integer', async function() {        
        var textField = new TextField({required: false});
        var tmp = await await textField.validate(4);
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error if text is longer than maxLength', async function() {        
        var textField = new TextField({maxLength: 5});
        var tmp = await await textField.validate("123456");
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error if text is shorter than minLength', async function() {        
        var textField = new TextField({minLength: 5});
        var tmp = await await textField.validate("1234");
        expect(tmp).not.toBe(undefined);
    });
    
    it('accepts if length is at bottom end inbetween max- and minLength', async function() {        
        var textField = new TextField({minLength: 3, maxLength: 10});
    
        var tmp = await await textField.validate("123");
        expect(tmp).toBe(undefined);
    });
    
    it('accepts if length is at top end inbetween max- and minLength', async function() {        
        var textField = new TextField({minLength: 3, maxLength: 10});
    
        var tmp = await await textField.validate("1234567890");
        expect(tmp).toBe(undefined);
    });
    
    
});