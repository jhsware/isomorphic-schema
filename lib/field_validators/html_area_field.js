'use strict';
var createObjectPrototype = require('component-registry').createObjectPrototype;
var TextAreaField = require('./base_fields').TextAreaField;
var i18n = require('../utils').i18n;
var striptags = require('striptags');


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
        var tmp = inp;
        if (typeof inp === 'string') {
            tmp = striptags(inp);
        }
        var error = this._ITextAreaField.validate.call(this, tmp);
        if (error) { return error };

        // TODO: should I add HTML validation? Might need cheerio, in which case 
        // perhaps only serverside validation to keep file size small in browser?
        // Could use striptags with allowed tags but it doesn't support attribute
        // stripping
    }
});
module.exports = HTMLAreaField;
