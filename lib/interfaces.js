'use strict';

const { createInterfaceClass } = require('component-registry')
const Interface = createInterfaceClass('isomorphic-schema')

function addMethods (base) {
    base.prototype.validate = function () {}
    base.prototype.fromString = function () {}
    base.prototype.toFormattedString = function () {}
}

module.exports.IBaseField = new Interface({
    name: 'IBaseField'
});
addMethods(module.exports.IBaseField)

module.exports.ITextField = new Interface({
    name: 'ITextField'
});
addMethods(module.exports.ITextField)

module.exports.ITextAreaField = new Interface({
    name: 'ITextAreaField'
});
addMethods(module.exports.ITextAreaField)

module.exports.IIntegerField = new Interface({
    name: 'IIntegerField'
});
addMethods(module.exports.IIntegerField)

module.exports.IDecimalField = new Interface({
    name: 'IDecimalField'
});
addMethods(module.exports.IDecimalField)

module.exports.IBoolField = new Interface({
    name: 'IBoolField'
});
addMethods(module.exports.IBoolField)

module.exports.ICreditCardField = new Interface({
    name: 'ICreditCardField'
});
addMethods(module.exports.ICreditCardField)

module.exports.IDateField = new Interface({
    name: 'IDateField'
});
addMethods(module.exports.IDateField)

module.exports.IDateTimeField = new Interface({
    name: 'IDateTimeField'
});
addMethods(module.exports.IDateTimeField)

module.exports.IEmailField = new Interface({
    name: 'IEmailField'
});
addMethods(module.exports.IEmailField)

module.exports.ITelephoneField = new Interface({
    name: 'ITelephoneField'
});
addMethods(module.exports.ITelephoneField)

module.exports.IListField = new Interface({
    name: 'IListField'
});
addMethods(module.exports.IListField)

module.exports.IObjectField = new Interface({
    name: 'IObjectField'
});
addMethods(module.exports.IObjectField)

module.exports.IObjectRelationField = new Interface({
    name: 'IObjectRelationField'
});
addMethods(module.exports.IObjectRelationField)

module.exports.IOrgNrField = new Interface({
    name: 'IOrgNrField'
});
addMethods(module.exports.IOrgNrField)

module.exports.IPasswordField = new Interface({
    name: 'IPasswordField'
});
addMethods(module.exports.IPasswordField)

module.exports.ISelectField = new Interface({
    name: 'ISelectField'
});
addMethods(module.exports.ISelectField)

module.exports.IDynamicSelectBaseField = new Interface({
    name: 'IDynamicSelectBaseField'
});
addMethods(module.exports.IDynamicSelectBaseField)

module.exports.IDynamicSelectAsyncBaseField = new Interface({
    name: 'IDynamicSelectAsyncBaseField'
});
addMethods(module.exports.IDynamicSelectAsyncBaseField)

module.exports.IMultiSelectField = new Interface({
    name: 'IMultiSelectField'
});
addMethods(module.exports.IMultiSelectField)

module.exports.IDynamicMultiSelectField = new Interface({
    name: 'IDynamicMultiSelectField'
});
addMethods(module.exports.IDynamicMultiSelectField)

/* Richtext HTML field */
module.exports.IHTMLAreaField =  new Interface({
    name: 'IHTMLAreaField'
});
addMethods(module.exports.IHTMLAreaField)

module.exports.IAnyOf =  new Interface({
    name: 'IAnyOf'
});
addMethods(module.exports.IAnyOf)