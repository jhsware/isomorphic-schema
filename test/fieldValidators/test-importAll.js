
import expect from 'expect.js'

import { TextField, IntegerField } from '../../lib'
import { TextField as _TextField_, IntegerField as _IntegerField_ } from '../../lib/field_validators'

// TODO: Write async tests

describe('Allows you to import all', function() {
    it('and instanciate them', function() {        
        const instance = new TextField()
        expect(instance).not.to.be(undefined);
    });

    it('and TextField is ok', function() {        
        expect(TextField).to.be(_TextField_);
    });

    it('and IntegerField is ok', function() {        
        expect(IntegerField).to.be(_IntegerField_);
    });
});