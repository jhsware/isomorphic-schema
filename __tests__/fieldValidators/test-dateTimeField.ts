
import { describe, expect, it } from "@jest/globals";
import {DateTimeField} from '../../src/field_validators/DateTimeField'

describe('DateTime field', function() {
    it('accepts valid date object without timezone', async function() {        
        var dateTimeField = new DateTimeField({required: true});

        var tmpDt = new Date("2015-01-01T10:18");
        var tmp = await dateTimeField.validate(tmpDt);
        expect(tmp).toBe(undefined);
    });
        
    it('throws error on undefined if required', async function() {        
        var dateTimeField = new DateTimeField({required: true});
        var tmp = await dateTimeField.validate(undefined);
        expect(tmp).not.toBe(undefined);
    });
            
    it('accepts datetime with UTC timezone', async function() {        
        var dateTimeField = new DateTimeField({required: true, timezoneAware: true});
        
        var tmpDt = new Date("2015-01-01T10:18+0000");
        var tmp = await dateTimeField.validate(tmpDt);
        
        expect(tmp).toBe(undefined);
    });

    it('throws error on invalid date object', async function() {        
        var dateTimeField = new DateTimeField({required: false});
        var tmp = await dateTimeField.validate({});
        expect(tmp).not.toBe(undefined);
    });
    
    it('moment in time doesn\'t change when converting to string', async function() {
        var dateTimeField = new DateTimeField({required: true, timezoneAware: true});
        
        var inpStr = "2015-01-01T10:18+0000";
        var tmpDt = dateTimeField.fromString(inpStr);
        var outpStr = dateTimeField.toFormattedString(tmpDt);
        //console.log(inpStr);
        //console.log(tmpDt.toISOString());x
        //console.log(outpStr);
        
        var tmpDtConverted = dateTimeField.fromString(outpStr);
        
        expect(tmpDt.toISOString()).toBe(tmpDtConverted.toISOString());
    });
    
    it('moment in time doesn\'t change when parsed from string', async function() {        
        var dateTimeField = new DateTimeField({required: true, timezoneAware: true});
        
        var inpStr = "2015-01-02T10:18:00.000Z";
        var inDt = new Date(Date.UTC(2015, 0, 2, 10, 18));
        var tmpDt = dateTimeField.fromString(inpStr);
                    
        expect(tmpDt.toISOString()).toBe(inDt.toISOString());
        
    });
    
    it('creates a proper Date object from string', async function() {        
        var dateTimeField = new DateTimeField({required: true, timezoneAware: true});
        
        var inpStr = "2015-01-02T10:18:00.000Z";
        var tmpDt = dateTimeField.fromString(inpStr);
        
        expect(tmpDt).toBeInstanceOf(Date);            
    });
    
});