import expect from 'expect.js'

import Schema from '../src/schema'
import TextField from '../src/field_validators/TextField'
import IntegerField from '../src/field_validators/IntegerField'
import EmailField from '../src/field_validators/EmailField'
import ObjectField from '../src/field_validators/ObjectField'
import ListField from '../src/field_validators/ListField'

var _genTestUserSchema = function () {
    
    return new Schema("User Schema", {
        username:               new TextField({required: true}),
        email:                  new EmailField({required: true}),
        password:               new TextField({required: false}),
        confirm_password:       new TextField({required: false}),
    });
};

var _genCustomerNoSchema = function () {    
    return new Schema("Customer Schema", {
        customer: new TextField({required: true}),
    });
};

var _genSpecialUserThatExtends = function (extendWithSchemas) {
    return new Schema({schemaName: "Special User Schema", extends: extendWithSchemas}, {
        role: new TextField({required: true})
    });
};

var _genSpecialUserThatExtendsAndOverrides = function (extendWithSchemas) {
    return new Schema({schemaName: "Override Schema", extends: extendWithSchemas}, {
        email: new TextField({required: true})
    });
};

var _genTestObjectSchema = function (options) {
    var userSchema = new Schema("User Schema", {
        username:               new TextField({required: true}),
        email:                  new EmailField({required: true}),
        password:               new TextField({required: false}),
        confirm_password:       new TextField({required: false}),
    });
    
    if (options.doNotValidateUserName) {
        userSchema.addValidationConstraint(_doNotValidateUsername);
    }
    
    return new Schema("Composed Schema", {
        user: new ObjectField({required: options.userIsRequired, schema: userSchema}),
        role: new TextField({required: true})
    });
};

var _genTestListSchema = function () {
    var userSchema = new Schema("User Schema", {
        username:               new TextField({required: true}),
        email:                  new EmailField({required: true}),
        password:               new TextField({required: false})
    });

    return new Schema("Schema With List", {
        users: new ListField({
            valueType: new ObjectField({required: true, schema: userSchema})
        })
    })
}

var _genTestOtherRO = function () {
    return new Schema("RO Schema", {
        titleOtherRO: new TextField({required: true, readOnly: true}),
        ageOtherRO: new TextField({required: true, readOnly: true}),
    });
};

var _genTestRO = function () {
    var otherRO = _genTestOtherRO()

    return new Schema("RO Schema", {
        titleRO: new TextField({required: true, readOnly: true}),
        ageRO: new TextField({required: true, readOnly: true}),
        otherObj: new ObjectField({required: true, schema: otherRO})
    });
};

var _genNested = function () {
  var testUserSchema = _genTestUserSchema()

  return new Schema("Nested Schema", {
      title: new TextField({required: true}),
      age: new TextField({required: true}),
      user: new ObjectField({required: true, schema: testUserSchema})
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

describe('Schema validation ASYNC', function() {
    it('ASYNC handles successful post with invariant', function(done) {
        var testUserSchema = _genTestUserSchema();
        testUserSchema.addInvariant(_invariantCheck);
        
        var promise = testUserSchema.validateAsync({
            username: 'jhsware',
            email: 'jhsware@email.com',
            password: 'mypassword',
            confirm_password: 'mypassword'
        });
        
        promise.then(function (formErrors) {
            expect(formErrors).to.be(undefined);
            done()
        })
    });

    it('ASYNC throws an error when inherited fields do not validate', function(done) {
        var userSchema = _genTestUserSchema();
        var custNoSchema = _genCustomerNoSchema();
        var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);
        
        var promise = specCustUserSchema.validateAsync({
            username: 'jhsware',
            email: 'jhsware@email.com',
            password: 'mypassword',
            confirm_password: 'mypassword'
            // Missing role and customer property
        });

        promise.then(function (formErrors) {
            expect(formErrors.fieldErrors.customer).not.to.be(undefined);
            expect(formErrors.fieldErrors.role).not.to.be(undefined);
            done();
        })        
    });

    it('ASYNC throws error when inherited invariant check fails', function(done) {
        var userSchema = _genTestUserSchema();
        userSchema.addInvariant(_invariantCheck);
        
        var custNoSchema = _genCustomerNoSchema();
        var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);
        
        var promise = specCustUserSchema.validateAsync({
            username: 'jhsware',
            customer: '1234',
            role: 'normal',
            email: 'jhsware@email.com',
            password: 'mypassword',
            confirm_password: 'wrongpassword'
        });
        
        promise.then(function (formErrors) {
            expect(formErrors.invariantErrors[0]).not.to.be(undefined);
            done();
        })
    });

    it('ASYNC is valid with correct, required, object field', function() {
        var testComplexSchema = _genTestObjectSchema({userIsRequired: true});
        
        var promise = testComplexSchema.validateAsync({
            user: {
                username: 'jhsware',
                email: 'jhsware@email.com',
                password: 'mypassword',
                confirm_password: 'mypassword'
            },
            role: 'ceo'
        });
        
        promise.then(function (formErrors) {
            expect(formErrors).to.be(undefined);
        })
    });
    
})

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
        
        expect(specUserSchema.getFields().username).to.not.be(undefined);
    });
    
    it('we can inherit multiple schemas', function() {        
        var userSchema = _genTestUserSchema();
        var custNoSchema = _genCustomerNoSchema();
        var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);
        
        expect(specCustUserSchema.getFields().username).to.not.be(undefined);
        expect(specCustUserSchema.getFields().customer).to.not.be(undefined);
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
        
        expect(formErrors.fieldErrors.customer).not.to.be(undefined);
        expect(formErrors.fieldErrors.role).not.to.be(undefined);
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
        
        expect(formErrors.invariantErrors[0]).not.to.be(undefined);
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
        number: new IntegerField({required: true}),
    });
};

var _genSchemaWithObject = function () {
    var integerSchema = _genSchemaWithInteger();

    return new Schema("Object Schema", {
        numberObj: new ObjectField({schema: integerSchema, required: true}),
    });
};


var _genOtherSchemaWithReadOnly = function () {
    return new Schema("Object Schema", {
        otherTitleRO: new TextField({readOnly: true, required: true}),
        otherAge: new IntegerField({required: true})
    });
};

var _genSchemaWithReadOnly = function () {
    var otherSchema = _genOtherSchemaWithReadOnly();

    return new Schema("ReadOnly Schema", {
        other: new ObjectField({schema: otherSchema, required: true}),
        otherRO: new ObjectField({schema: otherSchema, readOnly: true, required: true}),
        titleRO: new TextField({readOnly: true}),
        age: new IntegerField({required: true})
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
        }, { doNotRemoveReadOnly: true });
        
        expect(data.titleRO).to.equal('readOnly');
        expect(data.otherRO).not.to.be(undefined);
        expect(data.otherRO.otherTitleRO).to.equal('otherReadOnly');
        expect(data.otherRO).not.to.be(undefined);
        expect(data.other.otherTitleRO).to.equal('readOnly');
        expect(data.other.otherAge).to.equal(10);
        expect(data.age).to.equal(5);
    });
});

describe('Select and omit fields during validation', function() {
  it('Simple nested validate', function() {
      var nestedSchema = _genNested();
      
      var errors = nestedSchema.validate({
          title: "my_title",
          age: "666",
          user: {
            username: 'my_username',
            email: 'my@email.com'
          }
      });
      
      expect(typeof errors).to.equal('undefined');
  });

  it('Missing root level properties', function() {
    var nestedSchema = _genNested();
    
    var errors = nestedSchema.validate({
        age: "666",
        user: {
          username: 'my_username',
          email: 'my@email.com'
        }
    });
    
    expect(typeof errors).to.equal('object');
  });


  it('Select root level properties', function() {
    var nestedSchema = _genNested();
    
    var errors = nestedSchema.validate({
        age: "666",
        user: {
          username: 'my_username',
          email: 'my@email.com'
        }
    }, {
      selectedFields: ['age', 'user']
    });
    
    expect(typeof errors).to.equal('undefined');
  });

  it('Omit root level properties', function() {
    var nestedSchema = _genNested();
    
    var errors = nestedSchema.validate({
        age: "666",
        user: {
          username: 'my_username',
          email: 'my@email.com'
        }
    }, {
      omittedFields: ['title']
    });
    
    expect(typeof errors).to.equal('undefined');
  });


  it('Missing nested properties', function() {
    var nestedSchema = _genNested();
    
    var errors = nestedSchema.validate({
        title: 'my_title',
        age: "666",
        user: {
          email: 'my@email.com'
        }
    });
    
    expect(typeof errors).to.equal('object');
  });


  it('Select nested level properties', function() {
    var nestedSchema = _genNested();
    
    var errors = nestedSchema.validate({
      title: 'my_title',
      age: "666",
      user: {
        email: 'my@email.com'
      }
    }, {
      selectedFields: ['user.email']
    });
    
    expect(typeof errors).to.equal('undefined');
  });

  it('Omit nested level properties', function() {
    var nestedSchema = _genNested();
    
    var errors = nestedSchema.validate({
      title: 'my_title',
      age: "666",
      user: {
        email: 'my@email.com'
      }
    }, {
      omittedFields: ['user.username']
    });
  
    expect(typeof errors).to.equal('undefined');
  });

  it('Fail root level when select nested level properties', function() {
    var nestedSchema = _genNested();
    
    var errors = nestedSchema.validate({
      title: 'my_title',
      user: {
        email: 'my@email.com'
      }
    }, {
      selectedFields: ['age', 'user.email']
    });
    
    expect(typeof errors).to.equal('object');
  });

  it('Fail root level when omit nested level properties', function() {
    var nestedSchema = _genNested();
    
    var errors = nestedSchema.validate({
      age: "666",
      user: {
        email: 'my@email.com'
      }
    }, {
      omittedFields: ['user.username']
    });
  
    expect(typeof errors).to.equal('object');
  });
})
