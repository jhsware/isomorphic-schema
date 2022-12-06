
import { describe, expect, it } from "@jest/globals";
import TextAreaField from '../../src/field_validators/TextAreaField'

describe('TextArea field', function() {
    it('accepts strings', function() {        
        var textField = new TextAreaField({required: true});
    
        var tmp = textField.validate("this is a sting");
        expect(tmp).toBe(undefined);
    });

    it('throws error on undefined if required', function() {        
        var textField = new TextAreaField({required: true});
        var tmp = textField.validate();
        expect(tmp).not.toBe(undefined);
    });

    it('throws error on integer', function() {        
        var textField = new TextAreaField({required: false});
        var tmp = textField.validate(4);
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error if text is longer than maxLength', function() {        
        var textField = new TextAreaField({maxLength: 5});
        var tmp = textField.validate("123456");
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error if text is shorter than minLength', function() {        
        var textField = new TextAreaField({minLength: 5});
        var tmp = textField.validate("1234");
        expect(tmp).not.toBe(undefined);
    });
    
    it('accepts if length is at bottom end inbetween max- and minLength', function() {        
        var textField = new TextAreaField({minLength: 3, maxLength: 10});
    
        var tmp = textField.validate("123");
        expect(tmp).toBe(undefined);
    });
    
    it('accepts if length is at top end inbetween max- and minLength', function() {        
        var textField = new TextAreaField({minLength: 3, maxLength: 10});
    
        var tmp = textField.validate("1234567890");
        expect(tmp).toBe(undefined);
    });
    
    
});