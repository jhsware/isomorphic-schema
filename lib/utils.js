'use strict';

function cloneArray (arr) {
    var outp = arr.map(function (item) {
        if (Array.isArray(item)) {
            return cloneArray(item);
        } else if (typeof item === 'object') {
            var tmp = cloneObj(item);
            // Add prototype?
            tmp.prototype = item.prototype;
            return tmp;
        } else {
            return item;
        }
    })
    
    return outp;
}

// TODO: Handle Date objects?
var cloneObj = function (obj) {
    var outp = {}
    Object.keys(obj).forEach(function (key) {
        if (!obj.hasOwnProperty(key)) return
            
        var tmp = obj[key];
        if (Array.isArray(tmp)) {
            outp[key] = cloneArray(tmp);
        } else if (typeof tmp === 'object') {
            outp[key] = cloneObj(tmp);
            // Add prototype?
            outp[key].prototype = tmp.prototype;
        } else {
            outp[key] = tmp;
        }
    })
    outp.prototype = obj.prototype;
    
    return outp;
}
module.exports.clone = cloneObj;

/**
 * A helper method that returns the first parameter as is. The purpose of this
 * method is to allow parsing of code to find translation keys and also provide
 * a help text to the translator.
 * 
 * You would use this when you define text strings in your schemas.
 * @param {string} i18nKey -- the translation string key
 * @param {string} helpText -- a text describing the key
 *
 * @return {string} the passed i18nKey
 *
 * @example
 * i18n('form_label_title', 'The Title')
 */
var i18n = function (i18nKey, helpText) {
    return i18nKey;
}
module.exports.i18n = i18n;