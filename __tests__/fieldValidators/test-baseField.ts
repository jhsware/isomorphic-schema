
import { describe, expect, it } from "@jest/globals";
import {BaseField} from '../../src/field_validators/BaseField'

describe('Base field', function() {
    it('supports required', async function() {        
        var baseField = new BaseField({required: true});
    
        var tmp = await baseField.validate(undefined);
        expect(tmp).not.toBe(undefined);
        
        var tmp = await baseField.validate('something');
        expect(tmp).toBe(undefined);
    });
    
    it('shows error on required test if null', async function() {        
        var baseField = new BaseField({required: true});
    
        var tmp = await baseField.validate(null);
        expect(tmp).not.toBe(undefined);
        
        var tmp = await baseField.validate('something');
        expect(tmp).toBe(undefined);
    });

    it('supports being optional', async function() {        
        var baseField = new BaseField({required: false});
        var tmp = await baseField.validate(undefined);
        expect(tmp).toBe(undefined);

        var baseField = new BaseField();
        var tmp = await baseField.validate(undefined);
        expect(tmp).toBe(undefined);
    });
});