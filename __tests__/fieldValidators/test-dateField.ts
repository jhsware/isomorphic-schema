
import { describe, expect, it } from "@jest/globals";
import { DateField } from '../../src'

describe('Date field', function () {
    it('accepts strings', async function () {
        var dateField = new DateField({ required: true });

        var tmp = await dateField.validate("2015-01-01");
        expect(tmp).toBe(undefined);
    });

    it('throws error on undefined if required', async function () {
        var dateField = new DateField({ required: true });
        var tmp = await dateField.validate(undefined);
        expect(tmp).not.toBe(undefined);
    });

    it('throws error on malformed date', async function () {
        var dateField = new DateField({ required: false });
        var tmp = await dateField.validate("2015-1-9");
        expect(tmp).not.toBe(undefined);
    });

    it('throws error on invalid date', async function () {
        var dateField = new DateField({ required: false });
        var tmp = await dateField.validate("2015-13-01");
        expect(tmp).not.toBe(undefined);
    });
});