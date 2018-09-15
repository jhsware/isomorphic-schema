
import expect from 'expect.js'

import ObjectField from '../../src/field_validators/ObjectField'
import TextField from '../../src/field_validators/TextField'
import Schema from '../../src/schema'

// TODO: Test object field ASYNC validation

describe('Object field', function () {
    describe('Object field with defined schema', function() {
        var objectSchema = new Schema("User Schema", {
            username: new TextField({required: true}),
        })
        
        it('accepts valid object', function() {
            var objectField = new ObjectField({
                required: true,
                schema: objectSchema
            });
        
            var tmp = objectField.validate({
                username: "test_user"
            });
            
            expect(tmp).to.be(undefined);
        });

        it('throws error on undefined if required', function() {        
            var objectField = new ObjectField({
                required: true,
                schema: objectSchema
            });
            
            var tmp = objectField.validate();
            expect(tmp).to.not.be(undefined);
        });

        it("throws error when object schema doesn't validate", function() {        
            var objectField =  new ObjectField({
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
            username: new TextField({required: true}),
        })
        var fakeInterface = {
            schema: objectSchema
        };
        
        it('accepts valid object', function() {
            var objectField = new ObjectField({
                required: true,
                interface: fakeInterface
            });
        
            var tmp = objectField.validate({
                username: "test_user"
            });
            
            expect(tmp).to.be(undefined);
        });

        it('throws error on undefined if required', function() {        
            var objectField = new ObjectField({
                required: true,
                interface: fakeInterface
            });
            
            var tmp = objectField.validate();
            expect(tmp).to.not.be(undefined);
        });

        it("throws error when object schema doesn't validate", function() {        
            var objectField =  new ObjectField({
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
