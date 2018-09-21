
import expect from 'expect.js'

import { TextField, IntegerField } from '../../lib/field_validators'
import { fieldValidators } from '../../lib'

// TODO: Write async tests

describe('Allows you to import all', function() {
    it('and instanciate them', function() {        
        const instance = new TextField()
        expect(instance).not.to.be(undefined);
    });

    it('and TextField is ok', function() {        
        expect(TextField).to.be(fieldValidators.TextField);
    });

    it('and IntegerField is ok', function() {        
        expect(IntegerField).to.be(fieldValidators.IntegerField);
    });
});