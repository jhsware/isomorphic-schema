
import { describe, expect, it } from "@jest/globals";
import BaseField from '../../src/field_validators/BaseField'

describe('Base field', function() {
    it('supports required', function() {        
        var baseField = new BaseField({required: true});
    
        var tmp = baseField.validate();
        expect(tmp).not.toBe(undefined);
        
        var tmp = baseField.validate('something');
        expect(tmp).toBe(undefined);
    });
    
    it('shows error on required test if null', function() {        
        var baseField = new BaseField({required: true});
    
        var tmp = baseField.validate(null);
        expect(tmp).not.toBe(undefined);
        
        var tmp = baseField.validate('something');
        expect(tmp).toBe(undefined);
    });

    it('supports being optional', function() {        
        var baseField = new BaseField({required: false});
        var tmp = baseField.validate();
        expect(tmp).toBe(undefined);

        var baseField = new BaseField();
        var tmp = baseField.validate();
        expect(tmp).toBe(undefined);
    });
});