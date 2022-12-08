
import { describe, expect, it } from "@jest/globals";
import {TextAreaField} from '../../src/field_validators/TextAreaField'

describe('TextArea field', function() {
    it('accepts strings', async function() {        
        var textField = new TextAreaField({required: true});
    
        var tmp = await textField.validate("this is a sting");
        expect(tmp).toBe(undefined);
    });

    it('throws error on undefined if required', async function() {        
        var textField = new TextAreaField({required: true});
        var tmp = await textField.validate(undefined);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error on integer', async function() {        
        var textField = new TextAreaField({required: false});
        var tmp = await textField.validate(4);
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error if text is longer than maxLength', async function() {        
        var textField = new TextAreaField({maxLength: 5});
        var tmp = await textField.validate("123456");
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error if text is shorter than minLength', async function() {        
        var textField = new TextAreaField({minLength: 5});
        var tmp = await textField.validate("1234");
        expect(tmp).not.toBe(undefined);
    });
    
    it('accepts if length is at bottom end inbetween max- and minLength', async function() {        
        var textField = new TextAreaField({minLength: 3, maxLength: 10});
    
        var tmp = await textField.validate("123");
        expect(tmp).toBe(undefined);
    });
    
    it('accepts if length is at top end inbetween max- and minLength', async function() {        
        var textField = new TextAreaField({minLength: 3, maxLength: 10});
    
        var tmp = await textField.validate("1234567890");
        expect(tmp).toBe(undefined);
    });
    
    
});