'use strict';

var TextField = require('./base_fields').TextField;

/*
    Email-field
*/
var EmailField = function (options) {
    this._isSubTypeOf = new TextField(options);
    this._isRequired = options && options.required;
}

EmailField.prototype.type = 'EmailField';

EmailField.prototype.validate = function (inp) {
    var error = this._isSubTypeOf.validate(inp);
    if (error) { return error };
    
    // Required has been checked so if it is empty it is ok
    if (!inp) {
        return;
    }
    
    /* 
        Using a proper e-mail testing algorithm
        http://thedailywtf.com/articles/Validating_Email_Addresses
    */
    var add = inp;
    var ampisthere = false;
    var spacesthere = false;

    var textbeforeamp = false;
    var textafteramp = false;
    var dotafteramp = false;
    var othererror = false;

    for(var i = 0; i < add.length; ++i) {
      if(add.charAt(i) == '@') {
          if(ampisthere)
              othererror = true;

          ampisthere = true;
      } else if(!ampisthere)
          textbeforeamp = true;

      else if(add.charAt(i) == '.')
          dotafteramp = true;

      else
          textafteramp = true;

      if(add.charAt(i) == ' ' || add.charAt(i) == ',')
          spacesthere = true;

    }

    if(spacesthere || !ampisthere || !textafteramp || !textbeforeamp || !dotafteramp || othererror) {
        error = {
            type: 'type_error',
            message: "Det här är inte en riktig e-postadress"
        }
        
        return error;
    }
    
}

EmailField.prototype.toFormattedString = function (inp) {
    return inp;
}

EmailField.prototype.fromString = function (inp) {
    return inp;
}

module.exports = EmailField;