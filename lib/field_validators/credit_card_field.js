'use strict';

var createObjectPrototype = require('component-registry').createObjectPrototype;
var BaseField = require('./base_fields').BaseField;

/*
    Credit card field validator

    Port of:
    http://jquerycreditcardvalidator.com/
*/
var ICreditCardField = require('../interfaces').ICreditCardField;

var CreditCardField = createObjectPrototype({
    implements: [ICreditCardField],

    extends: [BaseField],
    
    constructor: function (options) {
        this._IBaseField.constructor(this, options);
        if (options) {
            this._cardValidationOptions = options.cardValidationOptions;
            delete options.cardValidationOptions;
        }
    },
    
    validate: function (inp) {
        var error = this._IBaseField.validate.call(this, inp);
        if (error) { return error };
    
        if (inp) {
            var message;
            try {
                var result = _validateCreditCard(inp, this._cardValidationOptions);
            
            } catch (e) {
                var type = 'constraint_error';
                message = "Inmatat kort stöds inte";
            } finally {
                if (!message && !(result.luhn_valid && result.length_valid)) {
                    var type = 'type_error';
                    message = "Kortnumret ser inte korrekt ut"
                };
                if (message) {
                    return {
                        type: type,
                        message: message
                    };                
                }
            }
        }
    },
    
    getMetaData: function (inp) {
        return _validateCreditCard(inp);
    },

    toFormattedString: function (inp) {
        if (inp) {
            var pretty = function (inp, type) {
                var formatter = _cardFormatters[type] || _cardFormatters['default'];
                return formatter(inp);
            } 
    
            try {
                var res = this._validateCreditCard(inp, this._cardValidationOptions);
            } catch (e) {
                // 
            }
    
            return pretty(inp);        
        } else {
            return ""
        }
    },

    fromString: function (inp) {
        return inp.replace(/\s/g, '');
    }
    
});
    
    
// Helper method to validate credit cards
var _validateCreditCard = function(inp, options) {
    var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
    var card, card_type, card_types, get_card_type, is_valid_length, is_valid_luhn, normalize, validate, validate_number, _i, _len, _ref, _ref1;
    card_types = [
      {
        name: 'amex',
        pattern: /^3[47]/,
        valid_length: [15]
      }, {
        name: 'diners_club_carte_blanche',
        pattern: /^30[0-5]/,
        valid_length: [14]
      }, {
        name: 'diners_club_international',
        pattern: /^36/,
        valid_length: [14]
      }, {
        name: 'jcb',
        pattern: /^35(2[89]|[3-8][0-9])/,
        valid_length: [16]
      }, {
        name: 'laser',
        pattern: /^(6304|670[69]|6771)/,
        valid_length: [16, 17, 18, 19]
      }, {
        name: 'visa_electron',
        pattern: /^(4026|417500|4508|4844|491(3|7))/,
        valid_length: [16]
      }, {
        name: 'visa',
        pattern: /^4/,
        valid_length: [16]
      }, {
        name: 'mastercard',
        pattern: /^5[1-5]/,
        valid_length: [16]
      }, {
        name: 'maestro',
        pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
        valid_length: [12, 13, 14, 15, 16, 17, 18, 19]
      }, {
        name: 'discover',
        pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
        valid_length: [16]
      }
    ];
    
    if (options == null) {
      options = {};
    }
    
    if ((_ref = options.accept) == null) {
      options.accept = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = card_types.length; _i < _len; _i++) {
          card = card_types[_i];
          _results.push(card.name);
        }
        return _results;
      })();
    }
    _ref1 = options.accept;
    
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      card_type = _ref1[_i];
      if (__indexOf.call((function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = card_types.length; _j < _len1; _j++) {
          card = card_types[_j];
          _results.push(card.name);
        }
        return _results;
      })(), card_type) < 0) {
        throw "Credit card type '" + card_type + "' is not supported";
      }
    }
    
    get_card_type = function(number) {
      var _j, _len1, _ref2;
      _ref2 = (function() {
        var _k, _len1, _ref2, _results;
        _results = [];
        for (_k = 0, _len1 = card_types.length; _k < _len1; _k++) {
          card = card_types[_k];
          if (_ref2 = card.name, __indexOf.call(options.accept, _ref2) >= 0) {
            _results.push(card);
          }
        }
        return _results;
      })();
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        card_type = _ref2[_j];
        if (number.match(card_type.pattern)) {
          return card_type;
        }
      }
      return null;
    };
    
    is_valid_luhn = function(number) {
      var digit, n, sum, _j, _len1, _ref2;
      sum = 0;
      _ref2 = number.split('').reverse();
      for (n = _j = 0, _len1 = _ref2.length; _j < _len1; n = ++_j) {
        digit = _ref2[n];
        digit = +digit;
        if (n % 2) {
          digit *= 2;
          if (digit < 10) {
            sum += digit;
          } else {
            sum += digit - 9;
          }
        } else {
          sum += digit;
        }
      }
      return sum % 10 === 0;
    };
    
    is_valid_length = function(number, card_type) {
      var _ref2;
      return _ref2 = number.length, __indexOf.call(card_type.valid_length, _ref2) >= 0;
    };
    
    validate_number = function(number) {
      var length_valid, luhn_valid;
      card_type = get_card_type(number);
      luhn_valid = false;
      length_valid = false;
      if (card_type != null) {
        luhn_valid = is_valid_luhn(number);
        length_valid = is_valid_length(number, card_type);
      }
      return {
        card_type: card_type,
        luhn_valid: luhn_valid,
        length_valid: length_valid
      };
    };
    
    validate = function() {
      var number;
      number = normalize(inp);
      return validate_number(number);
    };
    
    normalize = function(number) {
      return number.replace(/[ -]/g, '');
    };
    
    return validate();
};


var _cardFormatters = {
    default: function (inp) {
        var tmp = inp.match(/.{1,4}/g);
        return tmp.join(" ");
    }
}


module.exports = CreditCardField;