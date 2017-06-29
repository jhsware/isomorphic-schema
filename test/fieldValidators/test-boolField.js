var assert = require('assert');
var expect = require('expect.js');

var BoolField = require('../../lib/field_validators/BoolField');
var Schema = require('../../lib/schema');

describe('Bool field', function() {
    it('accepts boolean true', function() {        
        var boolField = new BoolField({required: true});
        var tmp = boolField.validate(true);
        expect(tmp).to.be(undefined);
    });

    it('accepts boolean false', function() {        
        var boolField = new BoolField({required: true});
        var tmp = boolField.validate(false);
        expect(tmp).to.be(undefined);
    });
    
    it('allows null or undefined if not required', function() {        
        var boolField = new BoolField({required: false});
        var tmp = boolField.validate(null);
        expect(tmp).to.be(undefined);
        var tmp = boolField.validate(undefined);
        expect(tmp).to.be(undefined);
    });
    
    it('converts string represenations to proper values', function() {        
        var boolField = new BoolField();
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