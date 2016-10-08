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