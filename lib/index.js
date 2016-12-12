'use strict';

module.exports.Schema = require('./schema');
module.exports.field_validators = require('./field_validators');
module.exports.interfaces = require('./interfaces');
module.exports.i18n = require('./utils').i18n;
module.exports.renderString = require('./utils').renderString;

var baseFields = require('./field_validators/base_fields'); 
module.exports.fieldObjectPrototypes = {
    BaseField: baseFields.BaseField,
    TextField: baseFields.TextField,
    TextAreaField: baseFields.TextAreaField,
    IntegerField: baseFields.IntegerField,
    DecimalField: baseFields.DecimalField,
    BoolField: baseFields.BoolField,
    HTMLAreaField: require('./field_validators/html_area_field'),
    EmailField: require('./field_validators/email_field'),
    CreditCardField: require('./field_validators/credit_card_field'),
    SelectField: require('./field_validators/select_field'),
    DynamicSelectBaseField: require('./field_validators/dynamic_select_base_field'),
    DynamicSelectAsyncBaseField: require('./field_validators/dynamic_select_async_base_field'),
    ListField: require('./field_validators/list_field'),
    ObjectField: require('./field_validators/object_field'),
    ObjectRelationField: require('./field_validators/object_relation_field'),
    PasswordField: require('./field_validators/password_field'),
    OrgNrField: require('./field_validators/org_nr_field'),
    DateField: require('./field_validators/date_field'),
    DateTimeField: require('./field_validators/datetime_field')
}