
import expect from 'expect.js'

import DateField from '../../src/field_validators/DateField'
import Schema from '../../src/schema'

describe('Date field', function() {
    it('accepts strings', function() {        
        var dateField = new DateField({required: true});
    
        var tmp = dateField.validate("2015-01-01");
        expect(tmp).to.be(undefined);
    });

    it('throws error on undefined if required', function() {        
        var dateField = new DateField({required: true});
        var tmp = dateField.validate();
        expect(tmp).to.not.be(undefined);
    });
    
    it('throws error on malformed date', function() {        
        var dateField = new DateField({required: false});
        var tmp = dateField.validate("2015-1-9");
        expect(tmp).to.not.be(undefined);
    });

    it('throws error on invalid date', function() {        
        var dateField = new DateField({required: false});
        var tmp = dateField.validate("2015-13-01");
        expect(tmp).to.not.be(undefined);
    });
});