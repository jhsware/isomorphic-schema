import { describe, expect, it } from "@jest/globals";
import Schema from '../src/schema'
import { TextField } from '../src/field_validators/TextField'
import IntegerField from '../src/field_validators/IntegerField'
import { EmailField } from '../src/field_validators/EmailField'
import ObjectField from '../src/field_validators/ObjectField'
import ListField from '../src/field_validators/ListField'

var _genTestUserSchema = function () {

  return new Schema({
    name: "User Schema",
    fields: {
      username: new TextField({ required: true }),
      email: new EmailField({ required: true }),
      password: new TextField({ required: false }),
      confirm_password: new TextField({ required: false }),
    }
  });
};

var _genCustomerNoSchema = function () {
  return new Schema({
    name: "Customer Schema",
    fields: {
      customer: new TextField({ required: true }),
    }
  });
};

var _genSpecialUserThatExtends = function (extendWithSchemas) {
  return new Schema({
    name: "Special User Schema",
    extend: extendWithSchemas,
    fields: {
      role: new TextField({ required: true })
    }
  });
};

var _genSpecialUserThatExtendsAndOverrides = function (extendWithSchemas) {
  return new Schema({
    name: "Override Schema", extend: extendWithSchemas, fields: {
      email: new TextField({ required: true })
    }
  });
};

var _genTestObjectSchema = function (options) {
  var userSchema = new Schema({
    name: "User Schema", fields: {
      username: new TextField({ required: true }),
      email: new EmailField({ required: true }),
      password: new TextField({ required: false }),
      confirm_password: new TextField({ required: false }),
    }
  });

  if (options.doNotValidateUserName) {
    userSchema.addValidationConstraint(_doNotValidateUsername);
  }

  return new Schema({
    name: "Composed Schema", fields: {
      user: new ObjectField({ required: options.userIsRequired, schema: userSchema }),
      role: new TextField({ required: true })
    }
  });
};

var _genTestListSchema = function () {
  var userSchema = new Schema({
    name: "User Schema", fields: {
      username: new TextField({ required: true }),
      email: new EmailField({ required: true }),
      password: new TextField({ required: false })
    }
  });

  return new Schema({
    name: "Schema With List", fields: {
      users: new ListField({
        valueType: new ObjectField({ required: true, schema: userSchema })
      })
    }
  })
}

var _genTestOtherRO = function () {
  return new Schema({
    name: "RO Schema", fields: {
      titleOtherRO: new TextField({ required: true, readOnly: true }),
      ageOtherRO: new TextField({ required: true, readOnly: true }),
    }
  });
};

var _genTestRO = function () {
  var otherRO = _genTestOtherRO()

  return new Schema({
    name: "RO Schema", fields: {
      titleRO: new TextField({ required: true, readOnly: true }),
      ageRO: new TextField({ required: true, readOnly: true }),
      otherObj: new ObjectField({ required: true, schema: otherRO })
    }
  });
};

var _genNested = function () {
  var testUserSchema = _genTestUserSchema()

  return new Schema({
    name: "Nested Schema", fields: {
      title: new TextField({ required: true }),
      age: new TextField({ required: true }),
      user: new ObjectField({ required: true, schema: testUserSchema })
    }
  });
};

var _invariantCheck = function (data, selectFields) {
  var tmpFields = ['password', 'confirm_password'];

  // Check that all the fields in this invariant are passed
  for (var i in tmpFields) {
    var key = tmpFields[i];
    if (selectFields.indexOf(key) < 0) {
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
  return fieldName !== 'username';
}

describe('Schema definition', async function () {
  it('can be created', async function () {
    var testUserSchema = _genTestUserSchema();

    expect(testUserSchema).not.toBe(undefined);
  });

  it('can validate correct data', async function () {
    var testUserSchema = _genTestUserSchema();

    var formErrors = await testUserSchema.validate({
      username: 'jhsware',
      email: 'jhsware@email.com',
      password: 'mypassword',
      confirm_password: 'mypassword'
    });

    expect(formErrors).toBe(undefined);
  });

  it('can validate correct data without required fields', async function () {
    var testUserSchema = _genTestUserSchema();

    var formErrors = await testUserSchema.validate({
      username: 'jhsware',
      email: 'jhsware@email.com'
    });

    expect(formErrors).toBe(undefined);
  });

  it('returns an error with faulty data', async function () {
    var testUserSchema = _genTestUserSchema();

    var formErrors = await testUserSchema.validate({
      username: 'jhsware',
      email: 'jhsware++email.com',
      password: 'mypassword',
      confirm_password: 'mypassword'
    });

    expect(formErrors).not.toBe(undefined);
    expect(formErrors.fieldErrors.email).not.toBe(undefined);
  });

  it('handles successful post with invariant', async function () {
    var testUserSchema = _genTestUserSchema();
    testUserSchema.addInvariant(_invariantCheck);

    var formErrors = await testUserSchema.validate({
      username: 'jhsware',
      email: 'jhsware@email.com',
      password: 'mypassword',
      confirm_password: 'mypassword'
    });

    expect(formErrors).toBe(undefined);
  });

  it('returns an error with unmet invariant check', async function () {
    var testUserSchema = _genTestUserSchema();
    testUserSchema.addInvariant(_invariantCheck);

    var formErrors = await testUserSchema.validate({
      username: 'jhsware',
      email: 'jhsware@email.com',
      password: 'mypassword',
      confirm_password: '----'
    });

    expect(formErrors).not.toBe(undefined);
    expect(formErrors.fieldErrors).toBe(undefined);
    expect(formErrors.invariantErrors.length).toEqual(1);
  });


  it('returns an error with unmet invariant check and field errors', async function () {
    var testUserSchema = _genTestUserSchema();
    testUserSchema.addInvariant(_invariantCheck);

    var formErrors = await testUserSchema.validate({
      username: 'jhsware',
      email: 'jhsware++email.com',
      password: 'mypassword',
      confirm_password: '----'
    });

    expect(formErrors).not.toBe(undefined);
    expect(formErrors.fieldErrors.email).not.toBe(undefined);
    expect(formErrors.invariantErrors.length).toEqual(1);
  });

  it('does not validate username according to validationConstraint', async function () {
    var testUserSchema = _genTestUserSchema();
    testUserSchema.addValidationConstraint(_doNotValidateUsername);

    var formErrors = await testUserSchema.validate({
      username: undefined,
      email: 'jhsware@email.com',
      password: 'mypassword',
      confirm_password: 'mypassword'
    });

    expect(formErrors).toBe(undefined);
  });

  it('is valid with correct, required, object field', async function () {
    var testComplexSchema = _genTestObjectSchema({ userIsRequired: true });

    var formErrors = await testComplexSchema.validate({
      user: {
        username: 'jhsware',
        email: 'jhsware@email.com',
        password: 'mypassword',
        confirm_password: 'mypassword'
      },
      role: 'ceo'
    });

    expect(formErrors).toBe(undefined);
  });

  it('throws error on invalid required object field', async function () {
    var testComplexSchema = _genTestObjectSchema({ userIsRequired: true });

    var formErrors = await testComplexSchema.validate({
      user: {
        username: undefined,
        email: 'jhsware@email.com',
        password: 'mypassword',
        confirm_password: 'mypassword'
      },
      role: 'ceo'
    });

    expect(formErrors).not.toBe(undefined);
    expect(formErrors.fieldErrors).not.toBe(undefined);
    expect(formErrors.invariantErrors).toBe(undefined);
  });

  it("is valid with field error in attribute on object that shouldn't be validated according to constraint", async function () {
    var testComplexSchema = _genTestObjectSchema({ doNotValidateUserName: true });

    var formErrors = await testComplexSchema.validate({
      user: {
        username: undefined,
        email: 'jhsware@email.com',
        password: 'mypassword',
        confirm_password: 'mypassword'
      },
      role: 'ceo'
    });

    expect(formErrors).toBe(undefined);
  });

});

describe('Schema validation ASYNC', async function () {
  it('ASYNC handles successful post with invariant', async function () {
    var testUserSchema = _genTestUserSchema();
    testUserSchema.addInvariant(_invariantCheck);

    var formErrors = await testUserSchema.validate({
      username: 'jhsware',
      email: 'jhsware@email.com',
      password: 'mypassword',
      confirm_password: 'mypassword'
    });

    expect(formErrors).toBe(undefined);
  });

  it('ASYNC throws an error when inherited fields do not validate', async function () {
    var userSchema = _genTestUserSchema();
    var custNoSchema = _genCustomerNoSchema();
    var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);

    var formErrors = await specCustUserSchema.validate({
      username: 'jhsware',
      email: 'jhsware@email.com',
      password: 'mypassword',
      confirm_password: 'mypassword'
      // Missing role and customer property
    });

    expect(formErrors.fieldErrors.customer).not.toBe(undefined);
    expect(formErrors.fieldErrors.role).not.toBe(undefined);
  });

  it('ASYNC throws error when inherited invariant check fails', async function () {
    var userSchema = _genTestUserSchema();
    userSchema.addInvariant(_invariantCheck);

    var custNoSchema = _genCustomerNoSchema();
    var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);

    var formErrors = await specCustUserSchema.validate({
      username: 'jhsware',
      customer: '1234',
      role: 'normal',
      email: 'jhsware@email.com',
      password: 'mypassword',
      confirm_password: 'wrongpassword'
    });

    expect(formErrors.invariantErrors[0]).not.toBe(undefined);
  });

  it('ASYNC is valid with correct, required, object field', async function () {
    var testComplexSchema = _genTestObjectSchema({ userIsRequired: true });

    var formErrors = await testComplexSchema.validate({
      user: {
        username: 'jhsware',
        email: 'jhsware@email.com',
        password: 'mypassword',
        confirm_password: 'mypassword'
      },
      role: 'ceo'
    });

    expect(formErrors).toBe(undefined);
  });

})

describe('Schema validation with read only fields', async function () {
  it('correct content is valid', async function () {
    var roSchema = _genTestRO();

    var errors = await roSchema.validate({
      titleRO: 'readOnly',
      ageRO: 5,
      otherObj: {
        titleOtherRO: "readOnly",
        ageOtherRO: 5
      }
    })

    expect(errors).toBe(undefined);
  });

  it('read only values pass validation if wrong', async function () {
    var roSchema = _genTestRO();

    var errors = await roSchema.validate({
      titleRO: undefined,
      ageRO: "hallo",
      otherObj: {
        titleOtherRO: undefined,
        ageOtherRO: "no"
      }
    })

    expect(errors).toBe(undefined);
  });
});


describe('Schema inheritance', async function () {
  it('we can inherit a single schema', async function () {
    var userSchema = _genTestUserSchema();
    var specUserSchema = _genSpecialUserThatExtends([userSchema]);

    expect(specUserSchema.getFields().username).not.toBe(undefined);
  });

  it('we can inherit multiple schemas', async function () {
    var userSchema = _genTestUserSchema();
    var custNoSchema = _genCustomerNoSchema();
    var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);

    expect(specCustUserSchema.getFields().username).not.toBe(undefined);
    expect(specCustUserSchema.getFields().customer).not.toBe(undefined);
  });

  it('throws an error when inherited fields do not validate', async function () {
    var userSchema = _genTestUserSchema();
    var custNoSchema = _genCustomerNoSchema();
    var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);

    var formErrors = await specCustUserSchema.validate({
      username: 'jhsware',
      email: 'jhsware@email.com',
      password: 'mypassword',
      confirm_password: 'mypassword'
      // Missing role and customer property
    });

    expect(formErrors.fieldErrors.customer).not.toBe(undefined);
    expect(formErrors.fieldErrors.role).not.toBe(undefined);
  });

  it('validates when inherited fields are ok', async function () {
    var userSchema = _genTestUserSchema();
    var custNoSchema = _genCustomerNoSchema();
    var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);

    var formErrors = await specCustUserSchema.validate({
      username: 'jhsware',
      customer: '1234',
      role: 'normal',
      email: 'jhsware@email.com',
      password: 'mypassword',
      confirm_password: 'mypassword'
    });

    expect(formErrors).toBe(undefined);
  });

  it('throws error when inherited invariant check fails', async function () {
    var userSchema = _genTestUserSchema();
    userSchema.addInvariant(_invariantCheck);

    var custNoSchema = _genCustomerNoSchema();
    var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);

    var formErrors = await specCustUserSchema.validate({
      username: 'jhsware',
      customer: '1234',
      role: 'normal',
      email: 'jhsware@email.com',
      password: 'mypassword',
      confirm_password: 'wrongpassword'
    });

    expect(formErrors.invariantErrors[0]).not.toBe(undefined);
  });

  it('respects validation constraints for inherited schemas', async function () {
    var userSchema = _genTestUserSchema();
    userSchema.addValidationConstraint(_doNotValidateUsername);
    var custNoSchema = _genCustomerNoSchema();
    var specCustUserSchema = _genSpecialUserThatExtends([userSchema, custNoSchema]);

    var formErrors = await specCustUserSchema.validate({
      // Missing username but it shouldn't be validated
      customer: '1234',
      role: 'normal',
      email: 'jhsware@email.com',
      password: 'mypassword',
      confirm_password: 'mypassword'
    });

    expect(formErrors).toBe(undefined);
  });

  it('overrides inherited schema field validation', async function () {
    var userSchema = _genTestUserSchema();
    var overrideSchema = _genSpecialUserThatExtendsAndOverrides([userSchema]);

    var formErrors = await overrideSchema.validate({
      username: 'jhsware',
      email: 'jhsware_weird_email.com',
      password: 'mypassword',
      confirm_password: 'wrongpassword'
    });

    expect(formErrors).toBe(undefined);
  });
});

var _genSchemaWithInteger = async function () {
  return new Schema({ name: "Integer Schema", fields: {
    number: new IntegerField({ required: true }),
  }});
};

var _genSchemaWithObject = async function () {
  var integerSchema = _genSchemaWithInteger();

  return new Schema({ name: "Object Schema", fields: {
    numberObj: new ObjectField({ schema: integerSchema, required: true }),
  }});
};


var _genOtherSchemaWithReadOnly = async function () {
  return new Schema({ name: "Object Schema", fields: {
    otherTitleRO: new TextField({ readOnly: true, required: true }),
    otherAge: new IntegerField({ required: true })
  }});
};

var _genSchemaWithReadOnly = async function () {
  var otherSchema = _genOtherSchemaWithReadOnly();

  return new Schema({ name: "ReadOnly Schema", fields: {
    other: new ObjectField({ schema: otherSchema, required: true }),
    otherRO: new ObjectField({ schema: otherSchema, readOnly: true, required: true }),
    titleRO: new TextField({ readOnly: true }),
    age: new IntegerField({ required: true })
  }});
};


describe('Schema data transformation', async function () {
  it('converts a simple integer field', async function () {
    var integerSchema = _genSchemaWithInteger();

    var data = integerSchema.transform({
      number: "5"
    });

    expect(typeof data.number).toEqual('number');
  });

  it('converts a simple integer field', async function () {
    var objSchema = _genSchemaWithObject();

    var data = objSchema.transform({
      numberObj: {
        number: "5"
      }
    });

    expect(typeof data.numberObj).toEqual('object');
    expect(typeof data.numberObj.number).toEqual('number');
  });

  it('converts a list field with objects', async function () {
    var listSchema = _genTestListSchema();

    var formData = {
      users: [
        { username: 'user', email: 'email@email.com', password: 'password' },
        { username: 'user', email: 'email@email.com', password: 'password' },
        { username: 'user', email: 'email@email.com', password: 'password' }
      ]
    };
    var data = listSchema.transform(formData);

    expect(Array.isArray(data.users)).toEqual(true);
    expect(data.users.length).toEqual(3);
    expect(typeof data.users[0]).toEqual('object');
    expect(data.users[0].email).toEqual(formData.users[0].email);
  });

  it('converts a nested object with readOnly fields removed', async function () {
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

    expect(data.titleRO).toBe(undefined);
    expect(data.otherRO).toBe(undefined);
    expect(data.other.titleRO).toBe(undefined);
    expect(data.other.otherAge).toEqual(10);
    expect(data.age).toEqual(5);
  });

  it('converts a nested object without removing readOnly fields', async function () {
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

    expect(data.titleRO).toEqual('readOnly');
    expect(data.otherRO).not.toBe(undefined);
    expect(data.otherRO.otherTitleRO).toEqual('otherReadOnly');
    expect(data.otherRO).not.toBe(undefined);
    expect(data.other.otherTitleRO).toEqual('readOnly');
    expect(data.other.otherAge).toEqual(10);
    expect(data.age).toEqual(5);
  });
});

describe('Select and omit fields during validation', async function () {
  it('Simple nested validate', async function () {
    var nestedSchema = _genNested();

    var errors = await nestedSchema.validate({
      title: "my_title",
      age: "666",
      user: {
        username: 'my_username',
        email: 'my@email.com'
      }
    });

    expect(typeof errors).toEqual('undefined');
  });

  it('Missing root level properties', async function () {
    var nestedSchema = _genNested();

    var errors = await nestedSchema.validate({
      age: "666",
      user: {
        username: 'my_username',
        email: 'my@email.com'
      }
    });

    expect(typeof errors).toEqual('object');
  });


  it('Select root level properties', async function () {
    var nestedSchema = _genNested();

    var errors = await nestedSchema.validate({
      age: "666",
      user: {
        username: 'my_username',
        email: 'my@email.com'
      }
    }, {
      selectFields: ['age', 'user']
    });

    expect(typeof errors).toEqual('undefined');
  });

  it('Select root level properties using selectFields', async function () {
    var nestedSchema = _genNested();

    var errors = await nestedSchema.validate({
      age: "666",
      user: {
        username: 'my_username',
        email: 'my@email.com'
      }
    }, {
      selectFields: ['age', 'user']
    });

    expect(typeof errors).toEqual('undefined');
  });

  it('Omit root level properties', async function () {
    var nestedSchema = _genNested();

    var errors = await nestedSchema.validate({
      age: "666",
      user: {
        username: 'my_username',
        email: 'my@email.com'
      }
    }, {
      omitFields: ['title']
    });

    expect(typeof errors).toEqual('undefined');
  });

  it('Omit root level properties using omitFields', async function () {
    var nestedSchema = _genNested();

    var errors = await nestedSchema.validate({
      age: "666",
      user: {
        username: 'my_username',
        email: 'my@email.com'
      }
    }, {
      omitFields: ['title']
    });

    expect(typeof errors).toEqual('undefined');
  });


  it('Missing nested properties', async function () {
    var nestedSchema = _genNested();

    var errors = await nestedSchema.validate({
      title: 'my_title',
      age: "666",
      user: {
        email: 'my@email.com'
      }
    });

    expect(typeof errors).toEqual('object');
  });


  it('Select nested level properties', async function () {
    var nestedSchema = _genNested();

    var errors = await nestedSchema.validate({
      title: 'my_title',
      age: "666",
      user: {
        email: 'my@email.com'
      }
    }, {
      selectFields: ['user.email']
    });

    expect(typeof errors).toEqual('undefined');
  });

  it('Omit nested level properties', async function () {
    var nestedSchema = _genNested();

    var errors = await nestedSchema.validate({
      title: 'my_title',
      age: "666",
      user: {
        email: 'my@email.com'
      }
    }, {
      omitFields: ['user.username']
    });

    expect(typeof errors).toEqual('undefined');
  });

  it('Fail root level when select nested level properties', async function () {
    var nestedSchema = _genNested();

    var errors = await nestedSchema.validate({
      title: 'my_title',
      user: {
        email: 'my@email.com'
      }
    }, {
      selectFields: ['age', 'user.email']
    });

    expect(typeof errors).toEqual('object');
  });

  it('Fail root level when omit nested level properties', async function () {
    var nestedSchema = _genNested();

    var errors = await nestedSchema.validate({
      age: "666",
      user: {
        email: 'my@email.com'
      }
    }, {
      omitFields: ['user.username']
    });

    expect(typeof errors).toEqual('object');
  });
})
