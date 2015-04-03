'use strict';

var createInterface = require('component-registry').createInterface;

module.exports.IBaseField = createInterface({
    name: 'IBaseField'
});

module.exports.ITextField = createInterface({
    name: 'ITextField'
});

module.exports.IIntegerField = createInterface({
    name: 'IIntegerField'
});

module.exports.ICreditCardField = createInterface({
    name: 'ICreditCardField'
});

module.exports.IDateField = createInterface({
    name: 'IDateField'
});

module.exports.IEmailField = createInterface({
    name: 'IEmailField'
});