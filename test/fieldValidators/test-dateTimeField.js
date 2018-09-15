
import expect from 'expect.js'

import DateTimeField from '../../src/field_validators/DateTimeField'
import Schema from '../../src/schema'

describe('DateTime field', function() {
    it('accepts valid date object without timezone', function() {        
        var dateTimeField = new DateTimeField({required: true});

        var tmpDt = new Date("2015-01-01T10:18");
        var tmp = dateTimeField.validate(tmpDt);
        expect(tmp).to.be(undefined);
    });
        
    it('throws error on undefined if required', function() {        
        var dateTimeField = new DateTimeField({required: true});
        var tmp = dateTimeField.validate();
        expect(tmp).to.not.be(undefined);
    });
            
    it('accepts datetime with UTC timezone', function() {        
        var dateTimeField = new DateTimeField({required: true, timezoneAware: true});
        
        var tmpDt = new Date("2015-01-01T10:18+0000");
        var tmp = dateTimeField.validate(tmpDt);
        
        expect(tmp).to.be(undefined);
    });

    it('throws error on invalid date object', function() {        
        var dateTimeField = new DateTimeField({required: false});
        var tmp = dateTimeField.validate({});
        expect(tmp).to.not.be(undefined);
    });
    
    it('moment in time doesn\'t change when converting to string', function() {
        var dateTimeField = new DateTimeField({required: true, timezoneAware: true});
        
        var inpStr = "2015-01-01T10:18+0000";
        var tmpDt = dateTimeField.fromString(inpStr);
        var outpStr = dateTimeField.toFormattedString(tmpDt);
        //console.log(inpStr);
        //console.log(tmpDt.toISOString());x
        //console.log(outpStr);
        
        var tmpDtConverted = dateTimeField.fromString(outpStr);
        
        expect(tmpDt.toISOString()).to.be(tmpDtConverted.toISOString());
    });
    
    it('moment in time doesn\'t change when parsed from string', function() {        
        var dateTimeField = new DateTimeField({required: true, timezoneAware: true});
        
        var inpStr = "2015-01-02T10:18:00.000Z";
        var inDt = new Date(Date.UTC(2015, 0, 2, 10, 18));
        var tmpDt = dateTimeField.fromString(inpStr);
                    
        expect(tmpDt.toISOString()).to.be(inDt.toISOString());
        
    });
    
    it('creates a proper Date object from string', function() {        
        var dateTimeField = new DateTimeField({required: true, timezoneAware: true});
        
        var inpStr = "2015-01-02T10:18:00.000Z";
        var tmpDt = dateTimeField.fromString(inpStr);
        
        expect(tmpDt).to.be.a(Date);            
    });
    
});