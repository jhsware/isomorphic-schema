
import { describe, expect, it } from "@jest/globals";
import { DecimalField } from '../../src/field_validators/DecimalField'

describe('Decimal field', function () {
    it('accepts non decimal numbers', async function () {
        var integerField = new DecimalField({ required: true });

        var tmp = await integerField.validate(6);
        expect(tmp).toBe(undefined);
    });

    it('accepts decimal numbers', async function () {
        var integerField = new DecimalField({ required: true });

        var tmp = await integerField.validate(6.0);
        expect(tmp).toBe(undefined);
    });

    it('accepts decimal numbers with fractions', async function () {
        var integerField = new DecimalField({ required: true });

        var tmp = await integerField.validate(13.3);
        expect(tmp).toBe(undefined);
    });

    it('accepts null as empty if field not required', async function () {
        var integerField = new DecimalField({ required: false });

        var tmp = await integerField.validate(null);
        expect(tmp).toBe(undefined);
    });

    it('converts string input properly with leading charaters and decimal', async function () {
        var integerField = new DecimalField({ required: true });

        var tmp = integerField.fromString("ab12.5");
        expect(tmp).toBe(12.5);
    });

    it('does not change decimal input', async function () {
        var integerField = new DecimalField({ required: true });

        var tmp = integerField.fromString(12.5);
        expect(tmp).toBe(12.5);
    });

    it('returns undefined if empty', async function () {
        var integerField = new DecimalField({ required: true });

        var tmp = integerField.fromString(12.5);
        expect(tmp).toBe(12.5);
    });

    it('renders undefined and null as the value they are when field has precision', async function () {
        var integerField = new DecimalField({ required: false, precision: 2 });

        var tmp = integerField.toFormattedString(undefined);
        expect(tmp).toBe(undefined);
        var tmp = integerField.toFormattedString(null);
        expect(tmp).toEqual(null);
    });

    it('returns empty string as undefined', async function () {
        var integerField = new DecimalField({ required: true });

        var tmp = integerField.fromString('');
        expect(tmp).toBe(undefined);
    });


    it('throws error on undefined if required', async function () {
        var integerField = new DecimalField({ required: true });
        var tmp = await integerField.validate(undefined);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error on null if required', async function () {
        var integerField = new DecimalField({ required: true });
        var tmp = await integerField.validate(null);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error when passed a string', async function () {
        var integerField = new DecimalField({ required: false });
        var tmp = await integerField.validate("4.05");
        expect(tmp).not.toBe(undefined);
    });

    it('throws error if smaller than minimum', async function () {
        var integerField = new DecimalField({ required: true, min: 1 });
        var tmp = await integerField.validate(0.99);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error if larger than maximum', async function () {
        var integerField = new DecimalField({ required: true, max: 10 });
        var tmp = await integerField.validate(11.6);
        expect(tmp).not.toBe(undefined);
    });

    it('renders correct number of decimals', async function () {
        var integerField = new DecimalField({ required: true, precision: 2 });
        var tmp = integerField.toFormattedString(11.123);
        expect(tmp).toBe('11.12');
    });

    it('rounds to precision', async function () {
        var integerField = new DecimalField({ required: true, precision: 2 });
        var tmp = integerField.fromString("11.123");
        expect(tmp).toBe(11.12);
    });


});