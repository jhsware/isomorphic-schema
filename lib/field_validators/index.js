'use strict';

var baseFields = require('./base_fields');

var EmailField = require('./email_field');
var CreditCardField = require('./credit_card_field');
var SelectField = require('./select_field');
var ListField = require('./list_field');
var ObjectField = require('./object_field');
var PasswordField = require('./password_field');
var OrgNrField = require('./org_nr_field');
var DateField = require('./date_field');

module.exports = {
    baseField: function (options) {return new baseFields.BaseField(options)},
    textField: function (options) {return new baseFields.TextField(options)},
    integerField: function (options) {return new baseFields.IntegerField(options)},
    passwordField: function (options) {return new PasswordField(options)},
    dateField: function (options) {return new DateField(options)},
    emailField: function (options) {return new EmailField(options)},
    creditCardField: function (options) {return new CreditCardField(options)},
    orgNrField: function (options) {return new OrgNrField(options)},
    selectField: function (options) {return new SelectField(options)},
    listField: function (options) {return new ListField(options)},
    objectField: function (options) {return new ObjectField(options)}
}