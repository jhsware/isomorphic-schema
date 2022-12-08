
import { describe, expect, it } from "@jest/globals";
import OrgNrField from '../../src/field_validators/OrgNrField'

/*
       9 5 0 1 0 1  0 0  1 2
    *  2 1 2 1 2 1  2 1  2 1
    -------------------------
        ^  ^ ^ ^ ^ ^  ^ ^  ^ 
      18 5 0 1 0 1  0 0  2 6 = 20
*/

describe('OrgNrField field', function() {
    it('accepts well formatted org nr', function() {
      var orgNrField = new OrgNrField({required: true});
      var tmp = orgNrField.validate('199501010012');
      expect(tmp).toBe(undefined);
    });

    it('throws error if wrong', function() {        
      var orgNrField = new OrgNrField({required: true});
      var tmp = orgNrField.validate('199501010019');
      expect(tmp).not.toBe(undefined);
    });
    
    it('converts string input properly', function() {        
      var orgNrField = new OrgNrField({required: true});
      var tmp = orgNrField.fromString("19950101-0012");
      expect(tmp).toBe('199501010012');
    });

    it('format full value properly', function() {        
      var orgNrField = new OrgNrField({required: true});
      var tmp = orgNrField.toFormattedString("199501010012");
      expect(tmp).toBe("19950101-0012");
    });

    it('format partial value properly', function() {        
      var orgNrField = new OrgNrField({required: true});
      var tmp = orgNrField.toFormattedString("19950101");
      expect(tmp).toBe("19950101-");
    });
    
    it('throws error on null if required', function() {        
      var orgNrField = new OrgNrField({required: true});
      var tmp = orgNrField.validate(null);
      expect(tmp).not.toBe(undefined);
    });

    
});
