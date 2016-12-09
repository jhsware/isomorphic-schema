'use strict';

var baseFields = require('./base_fields');
var HTMLAreaField = require('./html_area_field');
var EmailField = require('./email_field');
var CreditCardField = require('./credit_card_field');
var SelectField = require('./select_field');
var DynamicSelectField = require('./dynamic_select_field');
var MultiSelectField = require('./multi_select_field');
var ListField = require('./list_field');
var ObjectField = require('./object_field');
var ObjectRelationField = require('./object_relation_field');
var PasswordField = require('./password_field');
var OrgNrField = require('./org_nr_field');
var DateField = require('./date_field');
var DateTimeField = require('./datetime_field');
var TelephoneField = require('./telephone_field');

module.exports = {
    baseField: function (options) {return new baseFields.BaseField(options)},
    textField: function (options) {return new baseFields.TextField(options)},
    textAreaField: function (options) {return new baseFields.TextAreaField(options)},
    HTMLAreaField: function (options) {return new HTMLAreaField(options)},
    integerField: function (options) {return new baseFields.IntegerField(options)},
    decimalField: function (options) {return new baseFields.DecimalField(options)},
    boolField: function (options) {return new baseFields.BoolField(options)},
    passwordField: function (options) {return new PasswordField(options)},
    dateField: function (options) {return new DateField(options)},
    dateTimeField: function (options) {return new DateTimeField(options)},
    emailField: function (options) {return new EmailField(options)},
    telephoneField: function (options) {return new TelephoneField(options)},
    creditCardField: function (options) {return new CreditCardField(options)},
    orgNrField: function (options) {return new OrgNrField(options)},
    selectField: function (options) {return new SelectField(options)},
    dynamicSelectField: function (options) {return new DynamicSelectField(options)},
    multiSelectField: function (options) {return new MultiSelectField(options)},
    listField: function (options) {return new ListField(options)},
    objectField: function (options) {return new ObjectField(options)},
    objectRelationField: function (options) {return new ObjectRelationField(options)},
}