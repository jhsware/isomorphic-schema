var assert = require('assert');
var expect = require('expect.js');

var validators = require('../lib/field_validators');
var Schema = require('../lib/schema');

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

    describe('Text field', function() {
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

        it('throws error on single space if required and trim is true', function() {        
            var textField = validators.textField({required: true, trim: true});
            var tmp = textField.validate(' ');
            expect(tmp).to.not.be(undefined);
        });

        it('trims spaces if trim is true', function() {        
            var textField = validators.textField({trim: true});
            var tmp = textField.fromString(' a ');
            expect(tmp).to.equal('a');
        });

        it('throws error on integer', function() {        
            var textField = validators.textField({required: false});
            var tmp = textField.validate(4);
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error if text is longer than maxLength', function() {        
            var textField = validators.textField({maxLength: 5});
            var tmp = textField.validate("123456");
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error if text is shorter than minLength', function() {        
            var textField = validators.textField({minLength: 5});
            var tmp = textField.validate("1234");
            expect(tmp).to.not.be(undefined);
        });
        
        it('accepts if length is at bottom end inbetween max- and minLength', function() {        
            var textField = validators.textField({minLength: 3, maxLength: 10});
        
            var tmp = textField.validate("123");
            expect(tmp).to.be(undefined);
        });
        
        it('accepts if length is at top end inbetween max- and minLength', function() {        
            var textField = validators.textField({minLength: 3, maxLength: 10});
        
            var tmp = textField.validate("1234567890");
            expect(tmp).to.be(undefined);
        });
        
        
    });
    
    
    describe('TextArea field', function() {
        it('accepts strings', function() {        
            var textField = validators.textAreaField({required: true});
        
            var tmp = textField.validate("this is a sting");
            expect(tmp).to.be(undefined);
        });
    
        it('throws error on undefined if required', function() {        
            var textField = validators.textAreaField({required: true});
            var tmp = textField.validate();
            expect(tmp).to.not.be(undefined);
        });

        it('throws error on integer', function() {        
            var textField = validators.textAreaField({required: false});
            var tmp = textField.validate(4);
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error if text is longer than maxLength', function() {        
            var textField = validators.textAreaField({maxLength: 5});
            var tmp = textField.validate("123456");
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error if text is shorter than minLength', function() {        
            var textField = validators.textAreaField({minLength: 5});
            var tmp = textField.validate("1234");
            expect(tmp).to.not.be(undefined);
        });
        
        it('accepts if length is at bottom end inbetween max- and minLength', function() {        
            var textField = validators.textAreaField({minLength: 3, maxLength: 10});
        
            var tmp = textField.validate("123");
            expect(tmp).to.be(undefined);
        });
        
        it('accepts if length is at top end inbetween max- and minLength', function() {        
            var textField = validators.textAreaField({minLength: 3, maxLength: 10});
        
            var tmp = textField.validate("1234567890");
            expect(tmp).to.be(undefined);
        });
        
        
    });
    
    describe('Bool field', function() {
        it('accepts boolean true', function() {        
            var boolField = validators.boolField({required: true});
            var tmp = boolField.validate(true);
            expect(tmp).to.be(undefined);
        });
    
        it('accepts boolean false', function() {        
            var boolField = validators.boolField({required: true});
            var tmp = boolField.validate(false);
            expect(tmp).to.be(undefined);
        });
        
        it('allows null or undefined if not required', function() {        
            var boolField = validators.boolField({required: false});
            var tmp = boolField.validate(null);
            expect(tmp).to.be(undefined);
            var tmp = boolField.validate(undefined);
            expect(tmp).to.be(undefined);
        });
        
        it('converts string represenations to proper values', function() {        
            var boolField = validators.boolField();
            var tmp = boolField.fromString('false');
            expect(tmp).to.be(false);
            var tmp = boolField.fromString('true');
            expect(tmp).to.be(true);
            var tmp = boolField.fromString('undefined');
            expect(tmp).to.be(undefined);
            var tmp = boolField.fromString('null');
            expect(tmp).to.be(null);            
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
        
        it('renders null and undefined as empty string', function() {        
            var integerField = validators.integerField({requried: false});
        
            var tmp = integerField.toFormattedString(undefined);
            expect(tmp).to.be('');
            var tmp = integerField.toFormattedString(null);
            expect(tmp).to.be('');
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
    
    describe('List field', function() {
        it('accepts a list of fields', function() {
            var theField = validators.listField({
                required: true,
                valueType: validators.textField({required: true})});
        
            var tmp = theField.validate(["one", "two", "three"]);
            expect(tmp).to.be(undefined);
        });
        it('accepts a list of objects', function() {
            var objSchema = new Schema("Obj Schema", {
                title: validators.textField({required: true})
            })
            var theField = validators.listField({
                required: true,
                valueType: validators.objectField({required: true, schema: objSchema})});
        
            var tmp = theField.validate([{title: "one"}, {title: "two"}]);
            expect(tmp).to.be(undefined);
        });
        it('throws error if single item is invalid', function() {
            var theField = validators.listField({
                required: true,
                valueType: validators.textField({required: true})});
        
            var tmp = theField.validate(["one", undefined, "three"]);
            expect(tmp).not.to.be(undefined);
        });
        it('throws error if sub form is invalid', function() {
            var objSchema = new Schema("Obj Schema", {
                title: validators.textField({required: true})
            })
            var theField = validators.listField({
                required: true,
                valueType: validators.objectField({required: true, schema: objSchema})});
        
            var tmp = theField.validate([{}, {title: "two"}]);
            expect(tmp).not.to.be(undefined);
        });
        it('throws error if too few items', function() {
            var theField = validators.listField({
                required: true,
                minItems: 4,
                valueType: validators.textField({required: true})});
        
            var tmp = theField.validate(["one", "two", "three"]);
            expect(tmp).not.to.be(undefined);
        });
        it('throws error if too many items', function() {
            var theField = validators.listField({
                required: true,
                maxItems: 2,
                valueType: validators.textField({required: true})});
        
            var tmp = theField.validate(["one", "two", "three"]);
            expect(tmp).not.to.be(undefined);
        });
        it('throws correct error if too few items and sub form error', function() {
            var objSchema = new Schema("Obj Schema", {
                title: validators.textField({required: true})
            })
            var theField = validators.listField({
                required: true,
                minItems: 5,
                valueType: validators.objectField({required: true, schema: objSchema})});
        
            var tmp = theField.validate([{}, {title: "two"}]);
            expect(tmp).not.to.be(undefined);
            expect(tmp.i18nLabel).to.equal('isomorphic-schema--list_field_value_error_too_few_items')
        });
    });

    describe('Date field', function() {
        it('accepts strings', function() {        
            var dateField = validators.dateField({required: true});
        
            var tmp = dateField.validate("2015-01-01");
            expect(tmp).to.be(undefined);
        });
    
        it('throws error on undefined if required', function() {        
            var dateField = validators.dateField({required: true});
            var tmp = dateField.validate();
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error on malformed date', function() {        
            var dateField = validators.dateField({required: false});
            var tmp = dateField.validate("2015-1-9");
            expect(tmp).to.not.be(undefined);
        });

        it('throws error on invalid date', function() {        
            var dateField = validators.dateField({required: false});
            var tmp = dateField.validate("2015-13-01");
            expect(tmp).to.not.be(undefined);
        });
    });
    
    describe('DateTime field', function() {
        it('accepts valid date object without timezone', function() {        
            var dateTimeField = validators.dateTimeField({required: true});

            var tmpDt = new Date("2015-01-01T10:18");
            var tmp = dateTimeField.validate(tmpDt);
            expect(tmp).to.be(undefined);
        });
            
        it('throws error on undefined if required', function() {        
            var dateTimeField = validators.dateTimeField({required: true});
            var tmp = dateTimeField.validate();
            expect(tmp).to.not.be(undefined);
        });
                
        it('accepts datetime with UTC timezone', function() {        
            var dateTimeField = validators.dateTimeField({required: true, timezoneAware: true});
            
            var tmpDt = new Date("2015-01-01T10:18+0000");
            var tmp = dateTimeField.validate(tmpDt);
            
            expect(tmp).to.be(undefined);
        });

        it('throws error on invalid date object', function() {        
            var dateTimeField = validators.dateTimeField({required: false});
            var tmp = dateTimeField.validate({});
            expect(tmp).to.not.be(undefined);
        });
        
        it('moment in time doesn\'t change when converting to string', function() {
            var dateTimeField = validators.dateTimeField({required: true, timezoneAware: true});
            
            var inpStr = "2015-01-01T10:18+0000";
            var tmpDt = dateTimeField.fromString(inpStr);
            var outpStr = dateTimeField.toFormattedString(tmpDt);
            //console.log(inpStr);
            //console.log(tmpDt.toISOString());
            //console.log(outpStr);
            
            var tmpDtConverted = dateTimeField.fromString(outpStr);
            
            expect(tmpDt.toISOString()).to.be(tmpDtConverted.toISOString());
        });
        
        it('moment in time doesn\'t change when parsed from string', function() {        
            var dateTimeField = validators.dateTimeField({required: true, timezoneAware: true});
            
            var inpStr = "2015-01-02T10:18:00.000Z";
            var inDt = new Date(Date.UTC(2015, 0, 2, 10, 18));
            var tmpDt = dateTimeField.fromString(inpStr);
                        
            expect(tmpDt.toISOString()).to.be(inDt.toISOString());
            
        });
        
        it('creates a proper Date object from string', function() {        
            var dateTimeField = validators.dateTimeField({required: true, timezoneAware: true});
            
            var inpStr = "2015-01-02T10:18:00.000Z";
            var tmpDt = dateTimeField.fromString(inpStr);
            
            expect(tmpDt).to.be.a(Date);            
        });
        
    });

    describe('HTMLArea field', function() {
        it('accepts strings', function() {        
            var htmlField = validators.HTMLAreaField({required: true});
        
            var tmp = htmlField.validate("<p>this is a sting<p>");
            expect(tmp).to.be(undefined);
        });
    
        it('throws error on undefined if required', function() {        
            var htmlField = validators.HTMLAreaField({required: true});
            var tmp = htmlField.validate();
            expect(tmp).to.not.be(undefined);
        });

        it('throws error on integer', function() {        
            var htmlField = validators.HTMLAreaField({required: false});
            var tmp = htmlField.validate(4);
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error if text (exlcuding tags) is longer than maxLength', function() {        
            var htmlField = validators.textAreaField({maxLength: 5});
            var tmp = htmlField.validate("<p>123456</p>");
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error if text (exlcuding tags) is shorter than minLength', function() {        
            var htmlField = validators.HTMLAreaField({minLength: 5});
            var tmp = htmlField.validate("<p>1234</p>");
            expect(tmp).to.not.be(undefined);
        });

        it('accepts if text (exlcuding tags) is equal to maxLength', function() {        
            var htmlField = validators.HTMLAreaField({maxLength: 6});
            var tmp = htmlField.validate("<p>123456</p>");
            expect(tmp).to.be(undefined);
        });

        it('accepts if text (exlcuding tags) is equal to minLength', function() {        
            var htmlField = validators.HTMLAreaField({minLength: 5});
            var tmp = htmlField.validate("<p>12345</p>");
            expect(tmp).to.be(undefined);
        });

        it('accepts if text (exlcuding tags) is in between minLength and maxLength', function() {        
            var htmlField = validators.HTMLAreaField({minLength: 5, maxLength: 10});
            var tmp = htmlField.validate("<p>1234567</p>");
            expect(tmp).to.be(undefined);
        });
        
    });
    
    describe('Object field with defined schema', function() {
        var objectSchema = new Schema("User Schema", {
            username: validators.textField({required: true}),
        })
        
        it('accepts valid object', function() {
            var objectField = validators.objectField({
                required: true,
                schema: objectSchema
            });
        
            var tmp = objectField.validate({
                username: "test_user"
            });
            
            expect(tmp).to.be(undefined);
        });
    
        it('throws error on undefined if required', function() {        
            var objectField = validators.objectField({
                required: true,
                schema: objectSchema
            });
            
            var tmp = objectField.validate();
            expect(tmp).to.not.be(undefined);
        });

        it("throws error when object schema doesn't validate", function() {        
            var objectField =  validators.objectField({
                required: true,
                schema: objectSchema
            });
            
            var tmp = objectField.validate({
                username: undefined
            });
            expect(tmp).to.not.be(undefined);
        });        
        
    });

    describe('Object field with defined interface', function() {
        var objectSchema = new Schema("User Schema", {
            username: validators.textField({required: true}),
        })
        var fakeInterface = {
            schema: objectSchema
        };
        
        it('accepts valid object', function() {
            var objectField = validators.objectField({
                required: true,
                interface: fakeInterface
            });
        
            var tmp = objectField.validate({
                username: "test_user"
            });
            
            expect(tmp).to.be(undefined);
        });
    
        it('throws error on undefined if required', function() {        
            var objectField = validators.objectField({
                required: true,
                interface: fakeInterface
            });
            
            var tmp = objectField.validate();
            expect(tmp).to.not.be(undefined);
        });

        it("throws error when object schema doesn't validate", function() {        
            var objectField =  validators.objectField({
                required: true,
                interface: fakeInterface
            });
            
            var tmp = objectField.validate({
                username: undefined
            });
            expect(tmp).to.not.be(undefined);
        });        
        
    });

    describe('Telephone field', function() {
        it('accepts international phonenumber', function() {        
            var phoneField = validators.telephoneField({required: true});
        
            var tmp = phoneField.validate("+46 707 555 555");
            expect(tmp).to.be(undefined);
        });

        it('accepts local phonenumber', function() {        
            var phoneField = validators.telephoneField({required: true});
        
            var tmp = phoneField.validate("0707-55 55 55");
            expect(tmp).to.be(undefined);
        });
    
        it('throws error on undefined if required', function() {        
            var phoneField = validators.telephoneField({required: true});
            var tmp = phoneField.validate();
            expect(tmp).to.not.be(undefined);
        });
        
        it('throws error on malformed phonenumber', function() {        
            var phoneField = validators.telephoneField({required: false});
            var tmp = phoneField.validate("+4567$707 555 555");
            expect(tmp).to.not.be(undefined);
        });

        it('throws error on too many characters', function() {        
            var phoneField = validators.telephoneField({required: false});
            var tmp = phoneField.validate("1234567890123456");
            expect(tmp).to.not.be(undefined);
        });
    });

    
});