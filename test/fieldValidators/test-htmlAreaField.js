
import expect from 'expect.js'

import HTMLAreaField from '../../src/field_validators/HTMLAreaField'
import TextAreaField from '../../src/field_validators/TextAreaField'
import Schema from '../../src/schema'

describe('HTMLArea field', function() {
    it('accepts strings', function() {        
        var htmlField = new HTMLAreaField({required: true});
    
        var tmp = htmlField.validate("<p>this is a sting<p>");
        expect(tmp).to.be(undefined);
    });

    it('throws error on undefined if required', function() {        
        var htmlField = new HTMLAreaField({required: true});
        var tmp = htmlField.validate();
        expect(tmp).to.not.be(undefined);
    });

    it('throws error on integer', function() {        
        var htmlField = new HTMLAreaField({required: false});
        var tmp = htmlField.validate(4);
        expect(tmp).to.not.be(undefined);
    });
    
    it('throws error if text (exlcuding tags) is longer than maxLength', function() {        
        var htmlField = new TextAreaField({maxLength: 5});
        var tmp = htmlField.validate("<p>123456</p>");
        expect(tmp).to.not.be(undefined);
    });
    
    it('throws error if text (exlcuding tags) is shorter than minLength', function() {        
        var htmlField = new HTMLAreaField({minLength: 5});
        var tmp = htmlField.validate("<p>1234</p>");
        expect(tmp).to.not.be(undefined);
    });

    it('accepts if text (exlcuding tags) is equal to maxLength', function() {        
        var htmlField = new HTMLAreaField({maxLength: 6});
        var tmp = htmlField.validate("<p>123456</p>");
        expect(tmp).to.be(undefined);
    });

    it('accepts if text (exlcuding tags) is equal to minLength', function() {        
        var htmlField = new HTMLAreaField({minLength: 5});
        var tmp = htmlField.validate("<p>12345</p>");
        expect(tmp).to.be(undefined);
    });

    it('accepts if text (exlcuding tags) is in between minLength and maxLength', function() {        
        var htmlField = new HTMLAreaField({minLength: 5, maxLength: 10});
        var tmp = htmlField.validate("<p>1234567</p>");
        expect(tmp).to.be(undefined);
    });
    
});