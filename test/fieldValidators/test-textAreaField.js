var assert = require('assert');
var expect = require('expect.js');

var TextAreaField = require('../../lib/field_validators/TextAreaField');
var Schema = require('../../lib/schema');

describe('TextArea field', function() {
    it('accepts strings', function() {        
        var textField = new TextAreaField({required: true});
    
        var tmp = textField.validate("this is a sting");
        expect(tmp).to.be(undefined);
    });

    it('throws error on undefined if required', function() {        
        var textField = new TextAreaField({required: true});
        var tmp = textField.validate();
        expect(tmp).to.not.be(undefined);
    });

    it('throws error on integer', function() {        
        var textField = new TextAreaField({required: false});
        var tmp = textField.validate(4);
        expect(tmp).to.not.be(undefined);
    });
    
    it('throws error if text is longer than maxLength', function() {        
        var textField = new TextAreaField({maxLength: 5});
        var tmp = textField.validate("123456");
        expect(tmp).to.not.be(undefined);
    });
    
    it('throws error if text is shorter than minLength', function() {        
        var textField = new TextAreaField({minLength: 5});
        var tmp = textField.validate("1234");
        expect(tmp).to.not.be(undefined);
    });
    
    it('accepts if length is at bottom end inbetween max- and minLength', function() {        
        var textField = new TextAreaField({minLength: 3, maxLength: 10});
    
        var tmp = textField.validate("123");
        expect(tmp).to.be(undefined);
    });
    
    it('accepts if length is at top end inbetween max- and minLength', function() {        
        var textField = new TextAreaField({minLength: 3, maxLength: 10});
    
        var tmp = textField.validate("1234567890");
        expect(tmp).to.be(undefined);
    });
    
    
});