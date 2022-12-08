
import { describe, it, expect } from "@jest/globals";
import {PasswordField} from '../../src'

describe('Password field', function() {
  it('accepts strings', async function() {        
    var textField = new PasswordField({required: true});

    var tmp = await textField.validate("this is a sting");
    expect(tmp).toBe(undefined);
});

it('throws error on undefined if required', async function() {        
    var textField = new PasswordField({required: true});
    var tmp = await textField.validate(undefined);
    expect(tmp).not.toBe(undefined);
});

it('throws error on integer', async function() {        
    var textField = new PasswordField({required: false});
    var tmp = await textField.validate(4);
    expect(tmp).not.toBe(undefined);
});

it('throws error if text is longer than maxLength', async function() {        
    var textField = new PasswordField({maxLength: 5});
    var tmp = await textField.validate("123456");
    expect(tmp).not.toBe(undefined);
});

it('throws error if text is shorter than minLength', async function() {        
    var textField = new PasswordField({minLength: 5});
    var tmp = await textField.validate("1234");
    expect(tmp).not.toBe(undefined);
});

it('accepts if length is at bottom end inbetween max- and minLength', async function() {        
    var textField = new PasswordField({minLength: 3, maxLength: 10});

    var tmp = await textField.validate("123");
    expect(tmp).toBe(undefined);
});

it('accepts if length is at top end inbetween max- and minLength', async function() {        
    var textField = new PasswordField({minLength: 3, maxLength: 10});

    var tmp = await textField.validate("1234567890");
    expect(tmp).toBe(undefined);
});

});