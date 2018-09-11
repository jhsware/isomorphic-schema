'use strict';

/**
 * 
 * This is a simple deep clone method that doesn't handle circular references
 * but is fast and skinny. It is used internally to clone options.
 * Added it to keep package small.
 * 
 */
function cloneArray (arr) {
    var outp = arr.map(function (item) {
        if (Array.isArray(item)) {
            return cloneArray(item);
        } else if (typeof item === 'object') {
            var tmp = cloneObj(item);
            return tmp;
        } else {
            return item;
        }
    })
    
    return outp;
}

// TODO: Handle Date objects?
var cloneObj = function (obj) {
    var fn = function () {};
    fn.prototype = obj.prototype;
    var outp = new fn();
    
    Object.keys(obj).forEach(function (key) {
        if (!obj.hasOwnProperty(key)) return
            
        var tmp = obj[key];
        if (Array.isArray(tmp)) {
            outp[key] = cloneArray(tmp);
        } else if (typeof tmp === 'object') {
            outp[key] = cloneObj(tmp);
        } else {
            outp[key] = tmp;
        }
    })    
    return outp;
}
module.exports.clone = cloneObj;

module.exports.cloneShallow = function (obj) {
    var fn = function () {};
    fn.prototype = obj.prototype;
    var outp = new fn();
    
    Object.keys(obj).forEach(function (key) {
        if (!obj.hasOwnProperty(key)) return
        outp[key] = obj[key];
    })    
    return outp;
}

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
const i18n = function (i18nKey, helpText) {
    return i18nKey;
}
module.exports.i18n = i18n;

const regex = /\${([^}]+)}/g;
/**
 * A helper method that substitutes placeholders of the form ${propertyName}
 * with the value found in the field definition. Such as minValue on IntegerField
 * NOTE: It will add a preceding underscore automatically if needed!
 * @param {string} str -- the input string
 * @param {object} fieldDef -- the field validator
 *
 * @return {string} the rendered string
 *
 * @example
 * renderString('Min ${minValue}', personSchema.age)
 * 
 * Where personSchema.age is an IntegerField validator
 */
const renderString = function (str, fieldDef) {
    var m;
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
        m.forEach(function (match, groupIndex) {
            if (fieldDef[match] || fieldDef['_' + match]) {
                str = str.replace('${' + match + '}', fieldDef[match] || fieldDef['_' + match] )
            }
        });
    }
    return str;
}
module.exports.renderString = renderString;