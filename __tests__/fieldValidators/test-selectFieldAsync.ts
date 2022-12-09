
import { describe, expect, it } from "@jest/globals";
import { SelectFieldAsync } from '../../src'
import { TextField } from '../../src'
import { EmailField } from '../../src'

describe('Select field', function () {
  describe('Select field with options array', function () {
    it('allows you to select a value from the list', async function () {
      var theField = new SelectFieldAsync({
        required: true,
        valueType: new TextField({ required: true }),
        async getOptions() {
          return [
            { name: "select-me", label: "Select Me" },
            { name: "do-not-select", label: "Don't Select Me" }
          ]
        }
      });

      var tmp = await theField.validate("select-me");
      expect(tmp).toBe(undefined);
    });

    it('allows undefined or null if not required', async function () {
      var theField = new SelectFieldAsync({
        required: false,
        valueType: new TextField({ required: true }),
        async getOptions() {
          return [
            { name: "select-me", label: "Select Me" },
            { name: "do-not-select", label: "Don't Select Me" }
          ]
        }
      });

      var tmp = await theField.validate(undefined);
      expect(tmp).toBe(undefined);
      var tmp = await theField.validate(null);
      expect(tmp).toBe(undefined);

    });

    it('throws an error if selected value is outside list', async function () {
      var theField = new SelectFieldAsync({
        required: true,
        valueType: new TextField({ required: true }),
        async getOptions() {
          return [
            { name: "select-me", label: "Select Me" },
            { name: "do-not-select", label: "Don't Select Me" }
          ];
        }
      });

      var tmp = await theField.validate("outside-list");
      expect(tmp).not.toBe(undefined);
    });



    it('throws an error if wrong type', async function () {
      var theField = new SelectFieldAsync({
        required: true,
        valueType: new EmailField({ required: true }),
        async getOptions() {
          return [
            { name: "select-me", label: "Select Me" },
            { name: "do-not-select", label: "Don't Select Me" }
          ]
        }
      });

      var tmp = await theField.validate("select-me");
      expect(tmp).not.toBe(undefined);
    });

    it('can convert a value to a title', async function () {
      var theField = new SelectFieldAsync({
        required: true,
        valueType: new TextField({ required: true }),
        async getOptions() {
          return [
            { name: "select-me", label: "Select Me" },
            { name: "do-not-select", label: "Don't Select Me" }
          ]
        }
      });

      var tmp = await theField.getOptionLabel("select-me");
      expect(tmp).toEqual('Select Me');
    });

    it('convert a value to a title handles undefined', async function () {
      var theField = new SelectFieldAsync({
        required: true,
        valueType: new TextField({ required: true }),
        async getOptions() {
          return [
            { name: "select-me", label: "Select Me" },
            { name: "do-not-select", label: "Don't Select Me" }
          ]
        }
      });

      var tmp = await theField.getOptionLabel("no exist");
      expect(tmp).toBe(undefined);
    });
  });
});