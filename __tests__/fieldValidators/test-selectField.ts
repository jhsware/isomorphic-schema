
import { describe, expect, it } from "@jest/globals";
import SelectField from '../../src/field_validators/SelectField'
import TextField from '../../src/field_validators/TextField'
import EmailField from '../../src/field_validators/EmailField'

describe('Select field', function() {
    describe('Select field with options array', function() {
        it('allows you to select a value from the list', function() {        
            var theField = new SelectField({
                required: true,
                valueType: new TextField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate("select-me");
            expect(tmp).toBe(undefined);
        });
        
        it('allows undefined or null if not required', function() {        
            var theField = new SelectField({
                required: false,
                valueType: new TextField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate(undefined);
            expect(tmp).toBe(undefined);
            var tmp = theField.validate(null);
            expect(tmp).toBe(undefined);
            
        });

        it('throws an error if selected value is outside list', function() {        
            var theField = new SelectField({
                required: true,
                valueType: new TextField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate("outside-list");
            expect(tmp).not.toBe(undefined);
        });
        
        

        it('throws an error if wrong type', function() {        
            var theField = new SelectField({
                required: true,
                valueType: new EmailField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate("select-me");
            expect(tmp).not.toBe(undefined);
        });

        it('can convert a value to a title', function() {        
            var theField = new SelectField({
                required: true,
                valueType: new TextField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.getOptionTitle("select-me");
            expect(tmp).toEqual('Select Me');
        });

        it('convert a value to a title handles undefined', function() {        
            var theField = new SelectField({
                required: true,
                valueType: new TextField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.getOptionTitle("no exist");
            expect(tmp).toBe(undefined);
        });
    });
});