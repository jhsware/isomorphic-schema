'use strict';
var createObjectPrototype = require('component-registry').createObjectPrototype;
var TextAreaField = require('./base_fields').TextAreaField;
/*
    Text field
*/
var IHTMLAreaField = require('../interfaces').IHTMLAreaField;

var HTMLAreaField = createObjectPrototype({
    implements: [IHTMLAreaField],
    extends: [TextAreaField],
    
    constructor: function (options) {
        this._ITextAreaField.constructor.call(this, options);
    },
    
    validate: function (inp) {
        var error = this._ITextAreaField.validate.call(this, inp);
        if (error) { return error };

        // TODO: should I add HTML validation? Might need cheerio, in which case 
        // perhaps only serverside validation to keep file size small in browser?
    },
    
    toFormattedString: function (inp) {
        return inp;
    },
    
    fromString: function (inp) {
        return inp;
    }
});
module.exports = HTMLAreaField;
