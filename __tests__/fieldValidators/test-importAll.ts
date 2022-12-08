
import { describe, expect, it } from "@jest/globals";
import { TextField, IntegerField } from '../../src'
import { TextField as _TextField_, IntegerField as _IntegerField_ } from '../../src/field_validators'

// TODO: Write async tests

describe('Allows you to import all', function() {
    it('and instanciate them', function() {        
        const instance = new TextField()
        expect(instance).not.toBe(undefined);
    });

    it('and TextField is ok', function() {        
        expect(TextField).toBe(_TextField_);
    });

    it('and IntegerField is ok', function() {        
        expect(IntegerField).toBe(_IntegerField_);
    });
});