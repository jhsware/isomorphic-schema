'use strict'

import { createObjectPrototype } from 'component-registry'
import TextField from './TextField'
import { i18n } from '../utils'

/*
    Email-field
*/
import { IEmailField } from '../interfaces'

export default createObjectPrototype({
    implements: [IEmailField],

    extends: [TextField],
    
    constructor: function (options) {
        this._ITextField.constructor.call(this, options)
    },
    
    validate: function (inp) {
        var error = this._ITextField.validate.call(this, inp)
        if (error) { return Promise.resolve(error) }
    
        // Required has been checked so if it is empty it is ok
        if (!inp) {
            return Promise.resolve()
        }
    
        /* 
            Using a proper e-mail testing algorithm
            http://thedailywtf.com/articles/Validating_Email_Addresses
        */
        var add = inp
        var ampisthere = false
        var spacesthere = false

        var textbeforeamp = false
        var textafteramp = false
        var dotafteramp = false
        var othererror = false

        for(var i = 0; i < add.length; ++i) {
          if(add.charAt(i) == '@') {
              if(ampisthere)
                  othererror = true

              ampisthere = true
          } else if(!ampisthere)
              textbeforeamp = true

          else if(add.charAt(i) == '.')
              dotafteramp = true

          else
              textafteramp = true

          if(add.charAt(i) == ' ' || add.charAt(i) == ',')
              spacesthere = true

        }

        if(spacesthere || !ampisthere || !textafteramp || !textbeforeamp || !dotafteramp || othererror) {
            error = {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--email_field_incorrect_formatting', 'This is not a valid e-mail address'),
                message: "Det här är inte en riktig e-postadress"
            }
        
            return Promise.resolve(error)
        }

        return Promise.resolve()
    },
    
    toFormattedString: function (inp) {
        return inp
    },

    fromString: function (inp) {
        return inp
    }
})
