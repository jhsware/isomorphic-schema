'use strict';

module.exports.Schema = require('./schema');
module.exports.field_validators = require('./field_validators');
module.exports.interfaces = require('./interfaces');
module.exports.i18n = require('./utils').i18n;
module.exports.renderString = require('./utils').renderString;

var baseFields = require('./base_fields'); 
module.exports.fieldObjectPrototypes = {
    BaseFields: baseFields.BaseField,
    TextField: baseFields.TextField,
    TextAreaField: baseFields.TextAreaField,
    IntegerField: baseFields.IntegerField,
    DecimalField: baseFields.DecimalField,
    BoolField: baseFields.BoolField,
    HTMLAreaField: require('./html_area_field'),
    EmailField: require('./email_field'),
    CreditCardField: require('./credit_card_field'),
    SelectField: require('./select_field'),
    MultiSelectField: require('./multi_select_field'),
    ListField: require('./list_field'),
    ObjectField: require('./object_field'),
    ObjectRelationField: require('./object_relation_field'),
    PasswordField: require('./password_field'),
    OrgNrField: require('./org_nr_field'),
    DateField: require('./date_field'),
    DateTimeField: require('./datetime_field')
}