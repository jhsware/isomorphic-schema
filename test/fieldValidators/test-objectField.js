var assert = require('assert');
var expect = require('expect.js');

var validators = require('../../lib/field_validators');
var Schema = require('../../lib/schema');

describe('Object field', function () {
    describe('Object field with defined schema', function() {
        var objectSchema = new Schema("User Schema", {
            username: validators.textField({required: true}),
        })
        
        it('accepts valid object', function() {
            var objectField = validators.objectField({
                required: true,
                schema: objectSchema
            });
        
            var tmp = objectField.validate({
                username: "test_user"
            });
            
            expect(tmp).to.be(undefined);
        });

        it('throws error on undefined if required', function() {        
            var objectField = validators.objectField({
                required: true,
                schema: objectSchema
            });
            
            var tmp = objectField.validate();
            expect(tmp).to.not.be(undefined);
        });

        it("throws error when object schema doesn't validate", function() {        
            var objectField =  validators.objectField({
                required: true,
                schema: objectSchema
            });
            
            var tmp = objectField.validate({
                username: undefined
            });
            expect(tmp).to.not.be(undefined);
        });        
        
    });

    describe('Object field with defined interface', function() {
        var objectSchema = new Schema("User Schema", {
            username: validators.textField({required: true}),
        })
        var fakeInterface = {
            schema: objectSchema
        };
        
        it('accepts valid object', function() {
            var objectField = validators.objectField({
                required: true,
                interface: fakeInterface
            });
        
            var tmp = objectField.validate({
                username: "test_user"
            });
            
            expect(tmp).to.be(undefined);
        });

        it('throws error on undefined if required', function() {        
            var objectField = validators.objectField({
                required: true,
                interface: fakeInterface
            });
            
            var tmp = objectField.validate();
            expect(tmp).to.not.be(undefined);
        });

        it("throws error when object schema doesn't validate", function() {        
            var objectField =  validators.objectField({
                required: true,
                interface: fakeInterface
            });
            
            var tmp = objectField.validate({
                username: undefined
            });
            expect(tmp).to.not.be(undefined);
        });        
        
    });
})
