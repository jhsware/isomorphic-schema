
import { describe, expect, it } from "@jest/globals";
import {BoolField} from '../../src/field_validators/BoolField'

describe('Bool field', function() {
    it('accepts boolean true', async function() {        
        var boolField = new BoolField({required: true});
        var tmp = await boolField.validate(true);
        expect(tmp).toBe(undefined);
    });

    it('accepts boolean false', async function() {        
        var boolField = new BoolField({required: true});
        var tmp = await boolField.validate(false);
        expect(tmp).toBe(undefined);
    });
    
    it('allows null or undefined if not required', async function() {        
        var boolField = new BoolField({required: false});
        var tmp = await boolField.validate(null);
        expect(tmp).toBe(undefined);
        var tmp = await boolField.validate(undefined);
        expect(tmp).toBe(undefined);
    });
    
    it('converts string represenations to proper values', async function() {        
        var boolField = new BoolField();
        var tmp = boolField.fromString('false');
        expect(tmp).toBe(false);
        var tmp = boolField.fromString('true');
        expect(tmp).toBe(true);
        var tmp = boolField.fromString('undefined');
        expect(tmp).toBe(undefined);
        var tmp = boolField.fromString('null');
        expect(tmp).toBe(null);            
    });
    
    
});