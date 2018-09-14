'use strict'
import { createInterfaceClass } from 'component-registry'
const Interface = createInterfaceClass('isomorphic-schema')

function addMethods (base) {
    base.prototype.validate = function () {}
    base.prototype.fromString = function () {}
    base.prototype.toFormattedString = function () {}
}

const IBaseField = new Interface({
    name: 'IBaseField'
})
addMethods(IBaseField)

const ITextField = new Interface({
    name: 'ITextField'
})
addMethods(ITextField)

const ITextAreaField = new Interface({
    name: 'ITextAreaField'
})
addMethods(ITextAreaField)

const IIntegerField = new Interface({
    name: 'IIntegerField'
})
addMethods(IIntegerField)

const IDecimalField = new Interface({
    name: 'IDecimalField'
})
addMethods(IDecimalField)

const IBoolField = new Interface({
    name: 'IBoolField'
})
addMethods(IBoolField)

const ICreditCardField = new Interface({
    name: 'ICreditCardField'
})
addMethods(ICreditCardField)

const IDateField = new Interface({
    name: 'IDateField'
})
addMethods(IDateField)

const IDateTimeField = new Interface({
    name: 'IDateTimeField'
})
addMethods(IDateTimeField)

const IEmailField = new Interface({
    name: 'IEmailField'
})
addMethods(IEmailField)

const ITelephoneField = new Interface({
    name: 'ITelephoneField'
})
addMethods(ITelephoneField)

const IListField = new Interface({
    name: 'IListField'
})
addMethods(IListField)

const IObjectField = new Interface({
    name: 'IObjectField'
})
addMethods(IObjectField)

const IObjectRelationField = new Interface({
    name: 'IObjectRelationField'
})
addMethods(IObjectRelationField)

const IOrgNrField = new Interface({
    name: 'IOrgNrField'
})
addMethods(IOrgNrField)

const IPasswordField = new Interface({
    name: 'IPasswordField'
})
addMethods(IPasswordField)

const ISelectField = new Interface({
    name: 'ISelectField'
})
addMethods(ISelectField)

const IDynamicSelectBaseField = new Interface({
    name: 'IDynamicSelectBaseField'
})
addMethods(IDynamicSelectBaseField)

const IDynamicSelectAsyncBaseField = new Interface({
    name: 'IDynamicSelectAsyncBaseField'
})
addMethods(IDynamicSelectAsyncBaseField)

const IMultiSelectField = new Interface({
    name: 'IMultiSelectField'
})
addMethods(IMultiSelectField)

const IDynamicMultiSelectField = new Interface({
    name: 'IDynamicMultiSelectField'
})
addMethods(IDynamicMultiSelectField)

/* Richtext HTML field */
const IHTMLAreaField =  new Interface({
    name: 'IHTMLAreaField'
})
addMethods(IHTMLAreaField)

const IAnyOf =  new Interface({
    name: 'IAnyOf'
})
addMethods(IAnyOf)

export default {
    IBaseField,
    ITextField,
    ITextAreaField,
    IIntegerField,
    IDecimalField,
    IBoolField,
    ICreditCardField,
    IDateField,
    IDateTimeField,
    IEmailField,
    ITelephoneField,
    IListField,
    IObjectField,
    IObjectRelationField,
    IOrgNrField,
    IPasswordField,
    ISelectField,
    IDynamicSelectBaseField,
    IDynamicSelectAsyncBaseField,
    IMultiSelectField,
    IDynamicMultiSelectField,
    IHTMLAreaField,
    IAnyOf
}