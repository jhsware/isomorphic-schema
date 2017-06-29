var assert = require('assert');
var expect = require('expect.js');

var ListField = require('../../lib/field_validators/ListField');
var TextField = require('../../lib/field_validators/TextField');
var ObjectField = require('../../lib/field_validators/ObjectField');
var Schema = require('../../lib/schema');

// TODO: Test list field ASYNC validation

describe('List field', function() {
    it('accepts a list of fields', function() {
        var theField = new ListField({
            required: true,
            valueType: new TextField({required: true})});
    
        var tmp = theField.validate(["one", "two", "three"]);
        expect(tmp).to.be(undefined);
    });
    it('accepts a list of objects', function() {
        var objSchema = new Schema("Obj Schema", {
            title: new TextField({required: true})
        })
        var theField = new ListField({
            required: true,
            valueType: new ObjectField({required: true, schema: objSchema})});
    
        var tmp = theField.validate([{title: "one"}, {title: "two"}]);
        expect(tmp).to.be(undefined);
    });
    it('throws error if single item is invalid', function() {
        var theField = new ListField({
            required: true,
            valueType: new TextField({required: true})});
    
        var tmp = theField.validate(["one", undefined, "three"]);
        expect(tmp).not.to.be(undefined);
    });
    it('throws error if sub form is invalid', function() {
        var objSchema = new Schema("Obj Schema", {
            title: new TextField({required: true})
        })
        var theField = new ListField({
            required: true,
            valueType: new ObjectField({required: true, schema: objSchema})});
    
        var tmp = theField.validate([{}, {title: "two"}]);
        expect(tmp).not.to.be(undefined);
    });
    it('throws error if too few items', function() {
        var theField = new ListField({
            required: true,
            minItems: 4,
            valueType: new TextField({required: true})});
    
        var tmp = theField.validate(["one", "two", "three"]);
        expect(tmp).not.to.be(undefined);
    });
    it('throws error if too many items', function() {
        var theField = new ListField({
            required: true,
            maxItems: 2,
            valueType: new TextField({required: true})});
    
        var tmp = theField.validate(["one", "two", "three"]);
        expect(tmp).not.to.be(undefined);
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
        expect(tmp).not.to.be(undefined);
        expect(tmp.i18nLabel).to.equal('isomorphic-schema--list_field_value_error_too_few_items')
    });
});
