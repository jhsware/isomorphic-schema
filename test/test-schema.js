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

var _genTestListSchema = function () {
    var userSchema = new Schema("User Schema", {
        username:               validators.textField({required: true}),
        email:                  validators.emailField({required: true}),
        password:               validators.textField({required: false})
    });

    return new Schema("Schema With List", {
        users: validators.listField({
            valueType: validators.objectField({required: true, schema: userSchema})
        })
    })
}

var _genTestOtherRO = function () {
    return new Schema("RO Schema", {
        titleOtherRO: validators.textField({required: true, readOnly: true}),
        ageOtherRO: validators.textField({required: true, readOnly: true}),
    });
};

var _genTestRO = function () {
    var otherRO = _genTestOtherRO()

    return new Schema("RO Schema", {
        titleRO: validators.textField({required: true, readOnly: true}),
        ageRO: validators.textField({required: true, readOnly: true}),
        otherObj: validators.objectField({required: true, schema: otherRO})
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

describe('Schema validation with read only fields', function() {
    it('correct content is valid', function() {        
        var roSchema = _genTestRO();
        
        var errors = roSchema.validate({
            titleRO: 'readOnly',
            ageRO: 5,
            otherObj: {
                titleOtherRO: "readOnly",
                ageOtherRO: 5
            }
        })
        
        expect(errors).to.be(undefined);
    });

    it('read only values pass validation if wrong', function() {        
        var roSchema = _genTestRO();
        
        var errors = roSchema.validate({
            titleRO: undefined,
            ageRO: "hallo",
            otherObj: {
                titleOtherRO: undefined,
                ageOtherRO: "no"
            }
        })
        
        expect(errors).to.be(undefined);
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

var _genSchemaWithInteger = function () {    
    return new Schema("Integer Schema", {
        number: validators.integerField({required: true}),
    });
};

var _genSchemaWithObject = function () {
    var integerSchema = _genSchemaWithInteger();

    return new Schema("Object Schema", {
        numberObj: validators.objectField({schema: integerSchema, required: true}),
    });
};


var _genOtherSchemaWithReadOnly = function () {
    return new Schema("Object Schema", {
        otherTitleRO: validators.textField({readOnly: true, required: true}),
        otherAge: validators.integerField({required: true})
    });
};

var _genSchemaWithReadOnly = function () {
    var otherSchema = _genOtherSchemaWithReadOnly();

    return new Schema("ReadOnly Schema", {
        other: validators.objectField({schema: otherSchema, required: true}),
        otherRO: validators.objectField({schema: otherSchema, readOnly: true, required: true}),
        titleRO: validators.textField({readOnly: true}),
        age: validators.integerField({required: true})
    });
};


describe('Schema data transformation', function() {
    it('converts a simple integer field', function() {
        var integerSchema = _genSchemaWithInteger();
        
        var data = integerSchema.transform({
            number: "5"
        });
        
        expect(typeof data.number).to.equal('number');
    });

    it('converts a simple integer field', function() {
        var objSchema = _genSchemaWithObject();
        
        var data = objSchema.transform({
            numberObj: {
                number: "5"
            }
        });
        
        expect(typeof data.numberObj).to.equal('object');
        expect(typeof data.numberObj.number).to.equal('number');
    });

    it('converts a list field with objects', function() {
        var listSchema = _genTestListSchema();
        
        var formData = {
            users: [
                { username: 'user', email: 'email@email.com', password: 'password'},
                { username: 'user', email: 'email@email.com', password: 'password'},
                { username: 'user', email: 'email@email.com', password: 'password'}
            ]
        };
        var data = listSchema.transform(formData);
        
        expect(Array.isArray(data.users)).to.equal(true);
        expect(data.users.length).to.equal(3);
        expect(typeof data.users[0]).to.equal('object');
        expect(data.users[0].email).to.equal(formData.users[0].email);
    });

    it('converts a nested object with readOnly fields removed', function() {
        var objSchema = _genSchemaWithReadOnly();
        
        var data = objSchema.transform({
            titleRO: "readOnly",
            age: 5,
            other: {
                otherTitleRO: "readOnly",
                otherAge: 10
            },
            otherRO: {
                otherTitleRO: "otherReadOnly",
                otherAge: 20
            }
        });
        
        expect(data.titleRO).to.be(undefined);
        expect(data.otherRO).to.be(undefined);
        expect(data.other.titleRO).to.be(undefined);
        expect(data.other.otherAge).to.equal(10);
        expect(data.age).to.equal(5);
    });

    it('converts a nested object without removing readOnly fields', function() {
        var objSchema = _genSchemaWithReadOnly();
        
        var data = objSchema.transform({
            titleRO: "readOnly",
            age: 5,
            other: {
                otherTitleRO: "readOnly",
                otherAge: 10
            },
            otherRO: {
                otherTitleRO: "otherReadOnly",
                otherAge: 20
            }
        }, undefined, true);
        
        expect(data.titleRO).to.equal('readOnly');
        expect(data.otherRO).not.to.be(undefined);
        expect(data.otherRO.otherTitleRO).to.equal('otherReadOnly');
        expect(data.otherRO).not.to.be(undefined);
        expect(data.other.otherTitleRO).to.equal('readOnly');
        expect(data.other.otherAge).to.equal(10);
        expect(data.age).to.equal(5);
    });
});