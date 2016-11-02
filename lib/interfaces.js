'use strict';

var createInterface = require('component-registry').createInterface;

module.exports.IBaseField = createInterface({
    name: 'IBaseField'
});

module.exports.ITextField = createInterface({
    name: 'ITextField'
});

module.exports.ITextAreaField = createInterface({
    name: 'ITextAreaField'
});

module.exports.IIntegerField = createInterface({
    name: 'IIntegerField'
});

module.exports.IDecimalField = createInterface({
    name: 'IDecimalField'
});

module.exports.IBoolField = createInterface({
    name: 'IBoolField'
});

module.exports.ICreditCardField = createInterface({
    name: 'ICreditCardField'
});

module.exports.IDateField = createInterface({
    name: 'IDateField'
});

module.exports.IDateTimeField = createInterface({
    name: 'IDateTimeField'
});

module.exports.IEmailField = createInterface({
    name: 'IEmailField'
});

module.exports.ITelephoneField = createInterface({
    name: 'ITelephoneField'
});

module.exports.IListField = createInterface({
    name: 'IListField'
});

module.exports.IObjectField = createInterface({
    name: 'IObjectField'
});

module.exports.IObjectRelationField = createInterface({
    name: 'IObjectRelationField'
});

module.exports.IOrgNrField = createInterface({
    name: 'IOrgNrField'
});

module.exports.IPasswordField = createInterface({
    name: 'IPasswordField'
});

module.exports.ISelectField = createInterface({
    name: 'ISelectField'
});

module.exports.IMultiSelectField = createInterface({
    name: 'IMultiSelectField'
});

/* Richtext HTML field */
module.exports.IHTMLAreaField =  createInterface({
    name: 'IHTMLAreaField'
});