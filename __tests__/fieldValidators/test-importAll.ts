
import { describe, expect, it } from "@jest/globals";
import { TextField, IntegerField } from '../../src'
import { TextField as _TextField_, IntegerField as _IntegerField_ } from '../../src/field_validators'

describe('Allows you to import all', function() {
    it('and instanciate them', async function() {        
        const instance = new TextField()
        expect(instance).not.toBe(undefined);
    });

    it('and TextField is ok', async function() {        
        expect(TextField).toBe(_TextField_);
    });

    it('and IntegerField is ok', async function() {        
        expect(IntegerField).toBe(_IntegerField_);
    });
});