
import { describe, expect, it } from "@jest/globals";
import {ListField} from '../../src'
import {TextField} from '../../src'
import {ObjectField} from '../../src'
import {Schema } from '../../src/schema'
import { createIdFactory } from 'component-registry'
import {  IListField } from "../../src/interfaces";
const id = createIdFactory('test');

// TODO: Test list field ASYNC validation

describe('List field', function() {
    it('accepts a list of fields', async function() {
        var theField = new ListField({
            required: true,
            valueType: new TextField({required: true})});
    
        var tmp = await await theField.validate(["one", "two", "three"], undefined, undefined);
        expect(tmp).toBe(undefined);
    });
    it('accepts a list of objects', async function() {
        var objSchema = new Schema({name: "Obj Schema", fields: {
            title: new TextField({required: true})
        }})
        var theField = new ListField({
            required: true,
            valueType: new ObjectField({required: true, schema: objSchema})});
    
        var tmp = await await theField.validate([{title: "one"}, {title: "two"}], undefined, undefined);
        expect(tmp).toBe(undefined);
    });
    it('throws error if single item is invalid', async function() {
        var theField = new ListField({
            required: true,
            valueType: new TextField({required: true})});
    
        var tmp = await theField.validate(["one", undefined, "three"], undefined, undefined);
        expect(tmp).not.toBe(undefined);
    });
    it('throws error if sub form is invalid', async function() {
        var objSchema = new Schema({name: "Obj Schema", fields: {
            title: new TextField({required: true})
        }})
        var theField = new ListField({
            required: true,
            valueType: new ObjectField({required: true, schema: objSchema})});
    
        var tmp = await theField.validate([{}, {title: "two"}], undefined, undefined);
        expect(tmp).not.toBe(undefined);
    });
    it('throws error if too few items', async function() {
        var theField = new ListField({
            required: true,
            minItems: 4,
            valueType: new TextField({required: true})});
    
        var tmp = await theField.validate(["one", "two", "three"], undefined, undefined);
        expect(tmp).not.toBe(undefined);
    });
    it('throws error if too many items', async function() {
        var theField = new ListField({
            required: true,
            maxItems: 2,
            valueType: new TextField({required: true})});
    
        var tmp = await theField.validate(["one", "two", "three"], undefined, undefined);
        expect(tmp).not.toBe(undefined);
    });
    it('specialised field extending ListField throws error if too few items', async function() {
        class ISpecialListField extends IListField {};
        type TSpecialListField = Omit<ISpecialListField, 'interfaceId' | 'providedBy'>;

        class SpecialListField<T = TSpecialListField> extends ListField<T> implements TSpecialListField {
            readonly __implements__ = [ISpecialListField];
        }

        var theField = new SpecialListField({
            required: true,
            minItems: 4,
            valueType: new TextField({required: true})});
    
        var err = await theField.validate(["one", "two", "three"], undefined, undefined);
        expect(err).not.toBe(undefined);
    });
    it('throws correct error if too few items and sub form error', async function() {
        var objSchema = new Schema({ name: "Obj Schema", fields: {
            title: new TextField({required: true})
        }})
        var theField = new ListField({
            required: true,
            minItems: 5,
            valueType: new ObjectField({required: true, schema: objSchema})});
    
        var tmp = await await theField.validate([{}, {title: "two"}], undefined, undefined);
        expect(tmp).not.toBe(undefined);
        expect(tmp.i18nLabel).toEqual('isomorphic-schema--list_field_value_error_too_few_items')
    });
});
