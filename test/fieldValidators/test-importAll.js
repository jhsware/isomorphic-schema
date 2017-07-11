var assert = require('assert');
var expect = require('expect.js');

var fields = require('../../lib/field_validators');
var TextField = require('../../lib/field_validators/TextField');
var IntegerField = require('../../lib/field_validators/IntegerField');
var Schema = require('../../lib/schema');

// TODO: Write async tests

describe('Allows you to import all', function() {
    it('and instanciate them', function() {        
        Object.keys(fields).forEach(function (key) {
          var Field = fields[key]
          var instance = new Field()
        })
        expect(true).to.be(true);
    });

    it('and TextField is ok', function() {        
        expect(fields.TextField).to.be(TextField);
    });

    it('and IntegerField is ok', function() {        
        expect(fields.IntegerField).to.be(IntegerField);
    });
});