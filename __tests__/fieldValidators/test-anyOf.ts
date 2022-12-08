
import { describe, expect, it } from "@jest/globals";

import AnyOf from '../../src/field_validators/AnyOf'
import TextField from '../../src/field_validators/TextField'
import IntegerField from '../../src/field_validators/IntegerField'

// TODO: Write async tests

describe('Any of', function() {
    it('handles undefined when not required', function() {        
        var anyOf = new AnyOf({
            valueTypes: [
                new TextField({ required: true })
            ]
        });
    
        var tmp = anyOf.validate(undefined);
        expect(tmp).toBe(undefined);
    });

    it('throws error on undefined when required', function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new TextField({})
            ]
        });
    
        var tmp = anyOf.validate(undefined);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error if no value type validates', function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new IntegerField({})
            ]
        });
    
        var tmp = anyOf.validate("not a number");
        expect(tmp).not.toBe(undefined);
    });

    it('is ok if at least one value type validates (string)', function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new IntegerField({}),
                new TextField({})
            ]
        });
    
        var tmp = anyOf.validate("not a number");
        expect(tmp).toBe(undefined);
    });

    it('is ok if at least one value type validates (integer)', function() {
        var anyOf = new AnyOf({
            required: true,
            valueTypes: [
                new IntegerField({})
            ]
        });
    
        var tmp = anyOf.validate("234");
        expect(tmp).toBe(undefined);
    });
});