var assert = require('assert');
var expect = require('expect.js');

var validators = require('../../lib/field_validators');
var Schema = require('../../lib/schema');

// TODO: Test list field ASYNC validation

describe('List field', function() {
    it('accepts a list of fields', function() {
        var theField = validators.listField({
            required: true,
            valueType: validators.textField({required: true})});
    
        var tmp = theField.validate(["one", "two", "three"]);
        expect(tmp).to.be(undefined);
    });
    it('accepts a list of objects', function() {
        var objSchema = new Schema("Obj Schema", {
            title: validators.textField({required: true})
        })
        var theField = validators.listField({
            required: true,
            valueType: validators.objectField({required: true, schema: objSchema})});
    
        var tmp = theField.validate([{title: "one"}, {title: "two"}]);
        expect(tmp).to.be(undefined);
    });
    it('throws error if single item is invalid', function() {
        var theField = validators.listField({
            required: true,
            valueType: validators.textField({required: true})});
    
        var tmp = theField.validate(["one", undefined, "three"]);
        expect(tmp).not.to.be(undefined);
    });
    it('throws error if sub form is invalid', function() {
        var objSchema = new Schema("Obj Schema", {
            title: validators.textField({required: true})
        })
        var theField = validators.listField({
            required: true,
            valueType: validators.objectField({required: true, schema: objSchema})});
    
        var tmp = theField.validate([{}, {title: "two"}]);
        expect(tmp).not.to.be(undefined);
    });
    it('throws error if too few items', function() {
        var theField = validators.listField({
            required: true,
            minItems: 4,
            valueType: validators.textField({required: true})});
    
        var tmp = theField.validate(["one", "two", "three"]);
        expect(tmp).not.to.be(undefined);
    });
    it('throws error if too many items', function() {
        var theField = validators.listField({
            required: true,
            maxItems: 2,
            valueType: validators.textField({required: true})});
    
        var tmp = theField.validate(["one", "two", "three"]);
        expect(tmp).not.to.be(undefined);
    });
    it('throws correct error if too few items and sub form error', function() {
        var objSchema = new Schema("Obj Schema", {
            title: validators.textField({required: true})
        })
        var theField = validators.listField({
            required: true,
            minItems: 5,
            valueType: validators.objectField({required: true, schema: objSchema})});
    
        var tmp = theField.validate([{}, {title: "two"}]);
        expect(tmp).not.to.be(undefined);
        expect(tmp.i18nLabel).to.equal('isomorphic-schema--list_field_value_error_too_few_items')
    });
});
