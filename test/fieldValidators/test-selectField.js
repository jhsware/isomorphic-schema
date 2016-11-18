var assert = require('assert');
var expect = require('expect.js');

var registry = require('component-registry').globalRegistry
var createUtility = require('component-registry').createUtility
var createInterface = require('component-registry').createInterface

var validators = require('../../lib/field_validators');
var Schema = require('../../lib/schema');

var IOptions = createInterface({
    name: 'IOptions'
})
createUtility({
    implements: IOptions,
    name: 'test',
    
    getOptions: function (context, val) {
        return [{name: 'one', title: 'The One'}, {name: 'two', title: 'The Two'}]
    },

    getOptionTitle: function (context, val) {
        var tmp = {
            one: 'The One',
            two: 'The Two'
        }
        return tmp[val]
    }
}).registerWith(registry)

describe('Select field', function() {
    describe('Select field with options array', function() {
        it('allows you to select a value from the list', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.textField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate("select-me");
            expect(tmp).to.be(undefined);
        });
        
        it('allows undefined or null if not required', function() {        
            var theField = validators.selectField({
                required: false,
                valueType: validators.textField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate(undefined);
            expect(tmp).to.be(undefined);
            var tmp = theField.validate(null);
            expect(tmp).to.be(undefined);
            
        });

        it('throws an error if selected value is outside list', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.textField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate("outside-list");
            expect(tmp).to.not.be(undefined);
        });
        
        

        it('throws an error if wrong type', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.emailField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.validate("select-me");
            expect(tmp).to.not.be(undefined);
        });

        it('can convert a value to a title', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.textField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.getOptionTitle("select-me");
            expect(tmp).to.equal('Select Me');
        });

        it('convert a value to a title handles undefined', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.textField({required: true}),
                options: [
                    {name: "select-me", title: "Select Me"},
                    {name: "do-not-select", title: "Don't Select Me"}
                ]});
        
            var tmp = theField.getOptionTitle("no exist");
            expect(tmp).to.be(undefined);
        });
    });


    describe('Select field with options utility', function() {
        it('allows you to select a value from the list', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.textField({required: true}),
                options: { utilityInterface: IOptions, name: 'test'} 
            });
        
            var tmp = theField.validate("one");
            expect(tmp).to.be(undefined);
        });
        
        it('allows undefined or null if not required', function() {        
            var theField = validators.selectField({
                required: false,
                valueType: validators.textField({required: true}),
                options: { utilityInterface: IOptions, name: 'test'} 
            });
        
            var tmp = theField.validate(undefined);
            expect(tmp).to.be(undefined);
            var tmp = theField.validate(null);
            expect(tmp).to.be(undefined);
            
        });

        it('throws an error if selected value is outside list', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.textField({required: true}),
                options: { utilityInterface: IOptions, name: 'test'} 
            });
        
            var tmp = theField.validate("outside-list");
            expect(tmp).to.not.be(undefined);
        });

        it('throws an error if wrong type', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.integerField({required: true}),
                options: { utilityInterface: IOptions, name: 'test'} 
            });
        
            var tmp = theField.validate("select-me");
            expect(tmp).to.not.be(undefined);
        });

        it('can convert a value to a title', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.textField({required: true}),
                options: { utilityInterface: IOptions, name: 'test'} 
            });
        
            var tmp = theField.getOptionTitle("one");
            expect(tmp).to.equal('The One');
        });

        it('convert a value to a title handles undefined', function() {        
            var theField = validators.selectField({
                required: true,
                valueType: validators.textField({required: true}),
                options: { utilityInterface: IOptions, name: 'test'} 
            });
        
            var tmp = theField.getOptionTitle("no exist");
            expect(tmp).to.be(undefined);
        });
    });
});