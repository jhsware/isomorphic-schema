var assert = require('assert');
var expect = require('expect.js');

var validators = require('../../lib/field_validators');
var Schema = require('../../lib/schema');

describe('Email field', function() {
    it('accepts valid e-mail', function() {        
        var theField = validators.emailField({required: true});
    
        var tmp = theField.validate("valid@email.com");
        expect(tmp).to.be(undefined);
    });

    it('throws error if e-mail does not contain @', function() {        
        var theField = validators.emailField({required: true});
        var tmp = theField.validate("email--email.com");
        expect(tmp).to.not.be(undefined);
    });

    it('throws error if e-mail has funky domain name', function() {        
        var theField = validators.emailField({required: true});
        var tmp = theField.validate("email@email-com");
        expect(tmp).to.not.be(undefined);
    });
});
