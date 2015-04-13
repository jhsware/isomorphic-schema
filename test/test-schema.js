var assert = require('assert');
var expect = require('expect.js');

var Schema = require('../lib/schema');
var validators = require('../lib/field_validators');

var _genTestUserSchema = function () {
    
    return new Schema("User Schema", {
        username:               validators.textField({required: true}),
        email:                  validators.emailField({required: true}),
        password:               validators.textField({required: false}),
        confirm_password:       validators.textField({required: false}),
    });
};


var _genTestObjectSchema = function (options) {
    var userSchema = new Schema("User Schema", {
        username:               validators.textField({required: true}),
        email:                  validators.emailField({required: true}),
        password:               validators.textField({required: false}),
        confirm_password:       validators.textField({required: false}),
    });
    
    if (options.doNotValidateUserName) {
        userSchema.addValidationConstraint(_doNotValidateUsername);
    }
    
    return new Schema("Composed Schema", {
        user: validators.objectField({required: options.userIsRequired, schema: userSchema}),
        role: validators.textField({required: true})
    });
};

var _invariantCheck = function (data, selectedFields) {
    var tmpFields = ['password', 'confirm_password'];

    // Check that all the fields in this invariant are passed
    for (var i in tmpFields) {
        var key = tmpFields[i];
        if (selectedFields.indexOf(key) < 0) {
            // The fields aren't supplied so we don't do the test
            return
        }
    }
    
    if (data[tmpFields[0]] !== data[tmpFields[1]]) {
        return {
            message: "Lösenorden är olika!",
            fields: tmpFields
        }
    }
};

var _doNotValidateUsername = function (data, fieldName) {
    return (!fieldName == 'username');
}

describe('Schema definition', function() {
    it('can be created', function() {        
        var testUserSchema = _genTestUserSchema();
        
        expect(testUserSchema).to.not.be(undefined);
    });

    it('can validate correct data', function() {
        var testUserSchema = _genTestUserSchema();
        
        var formErrors = testUserSchema.validate({
            username: 'jhsware',
            email: 'jhsware@email.com',
            password: 'mypassword',
            confirm_password: 'mypassword'
        });
        
        expect(formErrors).to.be(undefined);
    });
    
    it('can validate correct data without required fields', function() {
        var testUserSchema = _genTestUserSchema();
        
        var formErrors = testUserSchema.validate({
            username: 'jhsware',
            email: 'jhsware@email.com'
        });
        
        expect(formErrors).to.be(undefined);
    });
    
    it('returns an error with faulty data', function() {
        var testUserSchema = _genTestUserSchema();
        
        var formErrors = testUserSchema.validate({
            username: 'jhsware',
            email: 'jhsware++email.com',
            password: 'mypassword',
            confirm_password: 'mypassword'
        });
                
        expect(formErrors).not.to.be(undefined);
        expect(formErrors.field_errors.email).to.not.be(undefined);
    });
    
    it('handles successful post with invariant', function() {
        var testUserSchema = _genTestUserSchema();
        testUserSchema.addInvariant(_invariantCheck);
        
        var formErrors = testUserSchema.validate({
            username: 'jhsware',
            email: 'jhsware@email.com',
            password: 'mypassword',
            confirm_password: 'mypassword'
        });
        
        expect(formErrors).to.be(undefined);
    });

    it('returns an error with unmet invariant check', function() {        
        var testUserSchema = _genTestUserSchema();
        testUserSchema.addInvariant(_invariantCheck);
        
        var formErrors = testUserSchema.validate({
            username: 'jhsware',
            email: 'jhsware@email.com',
            password: 'mypassword',
            confirm_password: '----'
        });
        
        expect(formErrors).not.to.be(undefined);
        expect(formErrors.field_errors).to.be(undefined);
        expect(formErrors.invariant_errors.length).to.equal(1);
    });

    
    it('returns an error with unmet invariant check and field errors', function() {        
        var testUserSchema = _genTestUserSchema();
        testUserSchema.addInvariant(_invariantCheck);
        
        var formErrors = testUserSchema.validate({
            username: 'jhsware',
            email: 'jhsware++email.com',
            password: 'mypassword',
            confirm_password: '----'
        });
        
        expect(formErrors).not.to.be(undefined);
        expect(formErrors.field_errors.email).to.not.be(undefined);
        expect(formErrors.invariant_errors.length).to.equal(1);
    });
    
    it('does not validate username according to validationConstraint', function() {        
        var testUserSchema = _genTestUserSchema();
        testUserSchema.addValidationConstraint(_doNotValidateUsername);
        
        var formErrors = testUserSchema.validate({
            username: undefined,
            email: 'jhsware@email.com',
            password: 'mypassword',
            confirm_password: 'mypassword'
        });
        
        expect(formErrors).to.be(undefined);
    });
    
    it('is valid with correct, required, object field', function() {
        var testComplexSchema = _genTestObjectSchema({userIsRequired: true});
        
        var formErrors = testComplexSchema.validate({
            user: {
                username: 'jhsware',
                email: 'jhsware@email.com',
                password: 'mypassword',
                confirm_password: 'mypassword'
            },
            role: 'ceo'
        });
        
        expect(formErrors).to.be(undefined);
    });
    
    it('throws error on invalid required object field', function() {
        var testComplexSchema = _genTestObjectSchema({userIsRequired: true});
        
        var formErrors = testComplexSchema.validate({
            user: {
                username: undefined,
                email: 'jhsware@email.com',
                password: 'mypassword',
                confirm_password: 'mypassword'
            },
            role: 'ceo'
        });
        
        expect(formErrors).not.to.be(undefined);
        expect(formErrors.field_errors).to.not.be(undefined);
        expect(formErrors.invariant_errors).to.be(undefined);
    });
    
    it("is valid with field error in attribute on object that shouldn't be validated according to constraint", function() {
        var testComplexSchema = _genTestObjectSchema({doNotValidateUserName: true});
        
        var formErrors = testComplexSchema.validate({
            user: {
                username: undefined,
                email: 'jhsware@email.com',
                password: 'mypassword',
                confirm_password: 'mypassword'
            },
            role: 'ceo'
        });
        
        expect(formErrors).to.be(undefined);
    });

});