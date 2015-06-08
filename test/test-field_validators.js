var assert = require('assert');
var expect = require('expect.js');

var validators = require('../lib/field_validators');

describe('Field validators', function() {
    describe('Base field', function() {
        it('supports required', function() {        
            var baseField = validators.baseField({required: true});
        
            var tmp = baseField.validate();
            expect(tmp).to.not.be(undefined);
            
            var tmp = baseField.validate('something');
            expect(tmp).to.be(undefined);
        });
        
        it('shows error on required test if null', function() {        
            var baseField = validators.baseField({required: true});
        
            var tmp = baseField.validate(null);
            expect(tmp).to.not.be(undefined);
            
            var tmp = baseField.validate('something');
            expect(tmp).to.be(undefined);
        });
    
        it('supports being optional', function() {        
            var baseField = validators.baseField({required: false});
            var tmp = baseField.validate();
            expect(tmp).to.be(undefined);

            var baseField = validators.baseField();
            var tmp = baseField.validate();
            expect(tmp).to.be(undefined);
        });
    });

    describe('String field', function() {
        it('accepts strings', function() {        
            var textField = validators.textField({required: true});
        
            var tmp = textField.validate("this is a sting");
            expect(tmp).to.be(undefined);
        });
    
        it('throws error on undefined if required', function() {        
            var textField = validators.textField({required: true});
            var tmp = textField.validate();
            expect(tmp).to.not.be(undefined);
        });

        it('throws error on integer', function() {        
            var textField = validators.textField({required: false});
            var tmp = textField.validate(4);
            expect(tmp).to.not.be(undefined);
        });
    });
    
    describe('Password field', function() {
        it('accepts strings', function() {        
            var passwordField = validators.passwordField({required: true});
        
            var tmp = passwordField.validate("thePassword");
            expect(tmp).to.be(undefined);
        });
    
        it('throws error on undefined if required', function() {        
            var passwordField = validators.passwordField({required: true});
            var tmp = passwordField.validate();
            expect(tmp).to.not.be(undefined);
        });

        it('throws error on less than 8 chars', function() {        
            var passwordField = validators.passwordField({required: false});
            var tmp = passwordField.validate('pass');
            expect(tmp).to.not.be(undefined);
        });
    });
    
    describe('Integer field', function() {
        it('accepts non decimal numbers', function() {        
            var integerField = validators.integerField({required: true});
        
            var tmp = integerField.validate(6);
            expect(tmp).to.be.undefined;
        });
        
        it('accepts decimal numbers without fractions', function() {        
            var integerField = validators.integerField({required: true});
        
            var tmp = integerField.validate(13.0);
            expect(tmp).to.be.undefined;
        });
        
        it('accepts null as empty if field not required', function() {        
            var integerField = validators.integerField({required: false});
        
            var tmp = integerField.validate(null);
            expect(tmp).to.be.undefined;
        });
        
        it('converts string input properly with leading charaters and decimal', function() {        
            var integerField = validators.integerField({required: true});
        
            var tmp = integerField.fromString("ab12.0");
            expect(tmp).to.be(12);
        });
        
        it('does not convert integer input', function() {        
            var integerField = validators.integerField({required: true});
        
            var tmp = integerField.fromString(12);
            expect(tmp).to.be(12);
        });
    
        it('throws error on undefined if required', function() {        
            var integerField = validators.integerField({required: true});
            var tmp = integerField.validate();
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error on null if required', function() {        
            var integerField = validators.integerField({required: true});
            var tmp = integerField.validate(null);
            expect(tmp).to.not.be(undefined);
        });

        it('throws error when passed a string', function() {        
            var integerField = validators.integerField({required: false});
            var tmp = integerField.validate("4");
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error when passed a float', function() {        
            var integerField = validators.integerField({required: false});
            var tmp = integerField.validate(6.4);
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error if smaller than minimum', function() {        
            var integerField = validators.integerField({required: true, min: 1});
            var tmp = integerField.validate(0);
            expect(tmp).to.not.be(undefined);
        });

        it('throws error if larger than maximum', function() {        
            var integerField = validators.integerField({required: true, max: 10});
            var tmp = integerField.validate(11);
            expect(tmp).to.not.be(undefined);
        });

        
    });

    describe('Decimal field', function() {
        it('accepts non decimal numbers', function() {        
            var integerField = validators.decimalField({required: true});
        
            var tmp = integerField.validate(6);
            expect(tmp).to.be.undefined;
        });
        
        it('accepts decimal numbers', function() {        
            var integerField = validators.decimalField({required: true});
        
            var tmp = integerField.validate(6.0);
            expect(tmp).to.be.undefined;
        });
        
        it('accepts decimal numbers with fractions', function() {        
            var integerField = validators.decimalField({required: true});
        
            var tmp = integerField.validate(13.3);
            expect(tmp).to.be.undefined;
        });
        
        it('accepts null as empty if field not required', function() {        
            var integerField = validators.decimalField({required: false});
        
            var tmp = integerField.validate(null);
            expect(tmp).to.be.undefined;
        });
        
        it('converts string input properly with leading charaters and decimal', function() {        
            var integerField = validators.decimalField({required: true});
        
            var tmp = integerField.fromString("ab12.5");
            expect(tmp).to.be(12.5);
        });
        
        it('does not change decimal input', function() {        
            var integerField = validators.decimalField({required: true});
        
            var tmp = integerField.fromString(12.5);
            expect(tmp).to.be(12.5);
        });
        
        it('returns undefined if empty', function() {        
            var integerField = validators.decimalField({required: true});
        
            var tmp = integerField.fromString(12.5);
            expect(tmp).to.be(12.5);
        });
        
        it('renders undefined and null as the value they are when field has precision', function() {        
            var integerField = validators.decimalField({required: false, precision: 2});
        
            var tmp = integerField.toFormattedString(undefined);
            expect(tmp).to.be.undefined;
            var tmp = integerField.toFormattedString(null);
            expect(tmp).to.be.null;
        });
        
        it('returns empty string as undefined', function() {        
            var integerField = validators.decimalField({required: true});
        
            var tmp = integerField.fromString('');
            expect(tmp).to.be.undefined;
        });
        
    
        it('throws error on undefined if required', function() {        
            var integerField = validators.decimalField({required: true});
            var tmp = integerField.validate();
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error on null if required', function() {        
            var integerField = validators.decimalField({required: true});
            var tmp = integerField.validate(null);
            expect(tmp).to.not.be(undefined);
        });

        it('throws error when passed a string', function() {        
            var integerField = validators.decimalField({required: false});
            var tmp = integerField.validate("4.05");
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error if smaller than minimum', function() {        
            var integerField = validators.decimalField({required: true, min: 1});
            var tmp = integerField.validate(0.99);
            expect(tmp).to.not.be(undefined);
        });

        it('throws error if larger than maximum', function() {        
            var integerField = validators.decimalField({required: true, max: 10});
            var tmp = integerField.validate(11.6);
            expect(tmp).to.not.be(undefined);
        });
        
        it('renders correct number of decimals', function() {        
            var integerField = validators.decimalField({required: true, precision: 2});
            var tmp = integerField.toFormattedString(11.123);
            expect(tmp).to.be('11.12');
        });
        
        it('rounds to precision', function() {        
            var integerField = validators.decimalField({required: true, precision: 2});
            var tmp = integerField.fromString("11.123");
            expect(tmp).to.be(11.12);
        });

        
    });


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
    
    describe('Credit Card field', function() {
        it('accepts valid Visa card', function() {        
            var theField = validators.creditCardField({required: true});
        
            var tmp = theField.validate("4242 4242 4242 4242");
            expect(tmp).to.be(undefined);
        });
        
        it('accepts valid Mastercard', function() {        
            var theField = validators.creditCardField({required: true});
        
            var tmp = theField.validate("5555 5555 5555 4444");
            expect(tmp).to.be(undefined);
        });
        
        it('accepts valid Amex', function() {        
            var theField = validators.creditCardField({required: true});
        
            var tmp = theField.validate("3782 822463 10005");
            expect(tmp).to.be(undefined);
        });
    
        it('throws error if number is wrong', function() {        
            var theField = validators.creditCardField({required: true});
            var tmp = theField.validate("0000 4242 4242 0000");
            expect(tmp).to.not.be(undefined);
        });

        it('throws error if number is too short', function() {        
            var theField = validators.creditCardField({required: true});
            var tmp = theField.validate("0000 0000");
            expect(tmp).to.not.be(undefined);
        });
    });
    

    describe('Select field', function() {
        it('allows you to select a value from the list', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.textField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate("select-me");
            expect(tmp).to.be(undefined);
        });
        
        it('allows undefined or null if not required', function() {        
            var theField = validators.selectField({
                required: false,
                valueType: validators.textField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate(undefined);
            expect(tmp).to.be(undefined);
            var tmp = theField.validate(null);
            expect(tmp).to.be(undefined);
            
        });
    
        it('throws an error if selected value is outside list', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.textField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate("outside-list");
            expect(tmp).to.not.be(undefined);
        });
        
        

        it('throws an error if wrong type', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.emailField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate("select-me");
            expect(tmp).to.not.be(undefined);
        });
    });
});