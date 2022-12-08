
import { describe, expect, it } from "@jest/globals";
import { AnyOf, TextField, IntegerField} from '../../src'

// TODO: Write async tests

describe('Any of', function() {
    it('handles undefined when not required', async function() {        
        var anyOf = new AnyOf({
            valueTypes: [
                new TextField({ required: true })
            ]
        });
    
        var tmp = await anyOf.validate(undefined);
        expect(tmp).toBe(undefined);
    });

    it('throws error on undefined when required', async function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new TextField({})
            ]
        });
    
        var tmp = await anyOf.validate(undefined);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error if no value type validates', async function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new IntegerField({})
            ]
        });
    
        var tmp = await anyOf.validate("not a number");
        expect(tmp).not.toBe(undefined);
    });

    it('is ok if at least one value type validates (string)', async function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new IntegerField({}),
                new TextField({})
            ]
        });
    
        var tmp = await anyOf.validate("not a number");
        expect(tmp).toBe(undefined);
    });

    it('is ok if at least one value type validates (integer)', async function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new IntegerField({})
            ]
        });
    
        var tmp = await anyOf.validate("234");
        expect(tmp).toBe(undefined);
    });
});