
import { describe, expect, it } from "@jest/globals";
import {HTMLAreaField} from '../../src'
import {TextAreaField} from '../../src'

describe('HTMLArea field', function() {
    it('accepts strings', async function() {        
        var htmlField = new HTMLAreaField({required: true});
    
        var tmp = await htmlField.validate("<p>this is a sting<p>");
        expect(tmp).toBe(undefined);
    });

    it('throws error on undefined if required', async function() {        
        var htmlField = new HTMLAreaField({required: true});
        var tmp = await htmlField.validate(undefined);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error on integer', async function() {        
        var htmlField = new HTMLAreaField({required: false});
        var tmp = await htmlField.validate(4);
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error if text (exlcuding tags) is longer than maxLength', async function() {        
        var htmlField = new TextAreaField({maxLength: 5});
        var tmp = await htmlField.validate("<p>123456</p>");
        expect(tmp).not.toBe(undefined);
    });
    
    it('throws error if text (exlcuding tags) is shorter than minLength', async function() {        
        var htmlField = new HTMLAreaField({minLength: 5});
        var tmp = await htmlField.validate("<p>1234</p>");
        expect(tmp).not.toBe(undefined);
    });

    it('accepts if text (exlcuding tags) is equal to maxLength', async function() {        
        var htmlField = new HTMLAreaField({maxLength: 6});
        var tmp = await htmlField.validate("<p>123456</p>");
        expect(tmp).toBe(undefined);
    });

    it('accepts if text (exlcuding tags) is equal to minLength', async function() {        
        var htmlField = new HTMLAreaField({minLength: 5});
        var tmp = await htmlField.validate("<p>12345</p>");
        expect(tmp).toBe(undefined);
    });

    it('accepts if text (exlcuding tags) is in between minLength and maxLength', async function() {        
        var htmlField = new HTMLAreaField({minLength: 5, maxLength: 10});
        var tmp = await htmlField.validate("<p>1234567</p>");
        expect(tmp).toBe(undefined);
    });
    
});