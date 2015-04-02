'use strict';

var BaseField = require('./base_fields').BaseField;

/*
    Credit card field validator

    Port of:
    http://jquerycreditcardvalidator.com/
*/
var OrgNrField = function (options) {
    this._isSubTypeOf = new BaseField(options);
    this._isRequired = options && options.required;
}

OrgNrField.prototype.type = 'OrgNrField';

var _validateOrgNr = function(inp, options) {
    /*
           8  1 1 2 1 8  9 8  7 6
        *  2  1 2 1 2 1  2 1  2 1
        -------------------------
           ^  ^ ^ ^ ^ ^  ^ ^  ^ 
          16  1 2 2 2 8 18 8 14 6
    
        1+6+1+2+2+2+8+1+8+8+1+4+6 = 50
    */
    
    var inpLst = inp.split("");
    if (inpLst.length < 10) {
        return "Inmatat nummer är för kort";
    }
    
    var luhLst = [2,1,2,1,2,1,2,1,2,1];
    var calcLst = luhLst.map(function (val, i) {
        return  luhLst[i] * parseInt(inpLst[i]);
    });
    var tmp = 0;
    calcLst.map(function (val) {
        tmp += (val % 10) + Math.floor(val/10);
    });
    if (tmp % 10 == 0) {
        return undefined
    } else {
        return "Kontrollsiffran stämmer inte"
    }
};

OrgNrField.prototype.validate = function (inp) {
    var error = this._isSubTypeOf.validate(inp);
    if (error) { return error };
    
    if (inp) {
        var message;
        try {
            var error = _validateOrgNr(inp);
            
        } catch (e) {
            var type = 'constraint_error';
            message = "Inmatat organisations-/personnummer har något seriöst fel";
        } finally {
            if (!message && error) {
                var type = 'type_error';
                message = error;
            };
            if (message) {
                return {
                    type: type,
                    message: message
                };                
            }
        }
    }
}

OrgNrField.prototype.toFormattedString = function (inp) {
    if (inp) {
        var tmp = inp.match(/.{1,6}/g);
        return tmp.join("-");       
    } else {
        return ""
    }
}

OrgNrField.prototype.fromString = function (inp) {
    var tmp = inp.replace(/([^0-9]*)/g, '');
    if (tmp.length > 10) {
        tmp = tmp.split("");
        tmp = tmp.splice(0,10);
        tmp = tmp.join("");
    }
    return tmp
}

module.exports = OrgNrField;