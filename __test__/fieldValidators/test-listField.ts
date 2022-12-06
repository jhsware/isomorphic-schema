
import { describe, expect, it } from "@jest/globals";
import ListField from '../../src/field_validators/ListField'
import TextField from '../../src/field_validators/TextField'
import ObjectField from '../../src/field_validators/ObjectField'
import Schema from '../../src/schema'
import { createObjectPrototype, createInterfaceClass } from 'component-registry'
const Interface = createInterfaceClass('test')

// TODO: Test list field ASYNC validation

describe('List field', function() {
    it('accepts a list of fields', function() {
        var theField = new ListField({
            required: true,
            valueType: new TextField({required: true})});
    
        var tmp = theField.validate(["one", "two", "three"]);
        expect(tmp).toBe(undefined);
    });
    it('accepts a list of objects', function() {
        var objSchema = new Schema("Obj Schema", {
            title: new TextField({required: true})
        })
        var theField = new ListField({
            required: true,
            valueType: new ObjectField({required: true, schema: objSchema})});
    
        var tmp = theField.validate([{title: "one"}, {title: "two"}]);
        expect(tmp).toBe(undefined);
    });
    it('throws error if single item is invalid', function() {
        var theField = new ListField({
            required: true,
            valueType: new TextField({required: true})});
    
        var tmp = theField.validate(["one", undefined, "three"]);
        expect(tmp).not.toBe(undefined);
    });
    it('throws error if sub form is invalid', function() {
        var objSchema = new Schema("Obj Schema", {
            title: new TextField({required: true})
        })
        var theField = new ListField({
            required: true,
            valueType: new ObjectField({required: true, schema: objSchema})});
    
        var tmp = theField.validate([{}, {title: "two"}]);
        expect(tmp).not.toBe(undefined);
    });
    it('throws error if too few items', function() {
        var theField = new ListField({
            required: true,
            minItems: 4,
            valueType: new TextField({required: true})});
    
        var tmp = theField.validate(["one", "two", "three"]);
        expect(tmp).not.toBe(undefined);
    });
    it('throws error if too many items', function() {
        var theField = new ListField({
            required: true,
            maxItems: 2,
            valueType: new TextField({required: true})});
    
        var tmp = theField.validate(["one", "two", "three"]);
        expect(tmp).not.toBe(undefined);
    });
    it('specialised field extending ListField throws error if too few items', function() {
        const ISpecialListField = new Interface({ name: 'ISpecialListField'})
        const SpecialListField = createObjectPrototype({
            implements: [ISpecialListField],
            extends: [ListField]
        })

        var theField = new SpecialListField({
            required: true,
            minItems: 4,
            valueType: new TextField({required: true})});
    
        var err = theField.validate(["one", "two", "three"]);
        expect(err).not.toBe(undefined);
    });
    it('throws correct error if too few items and sub form error', function() {
        var objSchema = new Schema("Obj Schema", {
            title: new TextField({required: true})
        })
        var theField = new ListField({
            required: true,
            minItems: 5,
            valueType: new ObjectField({required: true, schema: objSchema})});
    
        var tmp = theField.validate([{}, {title: "two"}]);
        expect(tmp).not.toBe(undefined);
        expect(tmp.i18nLabel).toEqual('isomorphic-schema--list_field_value_error_too_few_items')
    });
});
