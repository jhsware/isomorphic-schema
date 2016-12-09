var assert = require('assert');
var expect = require('expect.js');

var validators = require('../../lib/field_validators');
var Schema = require('../../lib/schema');

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