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

var _genCustomerNoSchema = function () {    
    return new Schema("Customer Schema", {
        customer: validators.textField({required: true}),
    });
};

var _genSpecialUserThatExtends = function (extendWithSchemas) {
    return new Schema({schemaName: "Special User Schema", extends: extendWithSchemas}, {
        role: validators.textField({required: true})
    });
};

var _genSpecialUserThatExtendsAndOverrides = function (extendWithSchemas) {
    return new Schema({schemaName: "Override Schema", extends: extendWithSchemas}, {
        email: validators.textField({required: true})
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
        expect(formErrors.fieldErrors.email).to.not.be(undefined);
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
        expect(formErrors.fieldErrors).to.be(undefined);
        expect(formErrors.invariantErrors.length).to.equal(1);
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
        expect(formErrors.fieldErrors.email).to.not.be(undefined);
        expect(formErrors.invariantErrors.length).to.equal(1);
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
        expect(formErrors.fieldErrors).to.not.be(undefined);
        expect(formErrors.invariantErrors).to.be(undefined);
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

describe('Schema inheritance', function() {
    it('we can inherit a single schema', function() {        
        var userSchema = _genTestUserSchema();
        var specUserSchema = _genSpecialUserThatExtends([userSchema]);
        
        expect(specUserSchema._fields.username).to.not.be(undefined);
    });
    
    it('we can inherit multiple schemas', function() {        
        var userSchema = _genTestUserSchema();
        var custNoSchema = _genCustomerNoSchema();
        var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);
        
        expect(specCustUserSchema._fields.username).to.not.be(undefined);
        expect(specCustUserSchema._fields.customer).to.not.be(undefined);
    });
    
    it('throws an error when inherited fields do not validate', function() {
        var userSchema = _genTestUserSchema();
        var custNoSchema = _genCustomerNoSchema();
        var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);
        
        var formErrors = specCustUserSchema.validate({
            username: 'jhsware',
            email: 'jhsware@email.com',
            password: 'mypassword',
            confirm_password: 'mypassword'
            // Missing role and customer property
        });
        
        expect(formErrors).not.to.be(undefined);
    });
    
    it('validates when inherited fields are ok', function() {
        var userSchema = _genTestUserSchema();
        var custNoSchema = _genCustomerNoSchema();
        var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);
        
        var formErrors = specCustUserSchema.validate({
            username: 'jhsware',
            customer: '1234',
            role: 'normal',
            email: 'jhsware@email.com',
            password: 'mypassword',
            confirm_password: 'mypassword'
        });
        
        expect(formErrors).to.be(undefined);
    });
    
    it('throws error when inherited invariant check fails', function() {
        var userSchema = _genTestUserSchema();
        userSchema.addInvariant(_invariantCheck);
        
        var custNoSchema = _genCustomerNoSchema();
        var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);
        
        var formErrors = specCustUserSchema.validate({
            username: 'jhsware',
            customer: '1234',
            role: 'normal',
            email: 'jhsware@email.com',
            password: 'mypassword',
            confirm_password: 'wrongpassword'
        });
        
        expect(formErrors).not.to.be(undefined);
    });
    
    it('respects validation constraints for inherited schemas', function() {        
        var userSchema = _genTestUserSchema();
        userSchema.addValidationConstraint(_doNotValidateUsername);
        var custNoSchema = _genCustomerNoSchema();
        var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);
        
        var formErrors = specCustUserSchema.validate({
            // Missing username but it shouldn't be validated
            customer: '1234',
            role: 'normal',
            email: 'jhsware@email.com',
            password: 'mypassword',
            confirm_password: 'mypassword'
        });
        
        expect(formErrors).to.be(undefined);
    });
    
    it('overrides inherited schema field validation', function() {
        var userSchema = _genTestUserSchema();
        var overrideSchema = _genSpecialUserThatExtendsAndOverrides([userSchema]);
        
        var formErrors = overrideSchema.validate({
            username: 'jhsware',
            email: 'jhsware_weird_email.com',
            password: 'mypassword',
            confirm_password: 'wrongpassword'
        });
        
        expect(formErrors).to.be(undefined);
    });
});