
import expect from 'expect.js'

import fields from '../../src/field_validators'
import TextField from '../../src/field_validators/TextField'
import IntegerField from '../../src/field_validators/IntegerField'

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