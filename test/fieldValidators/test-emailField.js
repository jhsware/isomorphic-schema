
import expect from 'expect.js'

import EmailField from '../../src/field_validators/EmailField'
import Schema from '../../src/schema'

describe('Email field', function() {
    it('accepts valid e-mail', function() {        
        var theField = new EmailField({required: true});
    
        var tmp = theField.validate("valid@email.com");
        expect(tmp).to.be(undefined);
    });

    it('throws error if e-mail does not contain @', function() {        
        var theField = new EmailField({required: true});
        var tmp = theField.validate("email--email.com");
        expect(tmp).to.not.be(undefined);
    });

    it('throws error if e-mail has funky domain name', function() {        
        var theField = new EmailField({required: true});
        var tmp = theField.validate("email@email-com");
        expect(tmp).to.not.be(undefined);
    });
});
