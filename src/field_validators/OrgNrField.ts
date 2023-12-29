import { TextField } from './TextField'
import { IBaseField, IOrgNrField, ITextField } from '../interfaces'
import { TFieldError } from '../schema'
import { i18n } from '../utils'
import { TypeFromInterface } from 'component-registry';

/*
    Swedish Org-nr validator
*/
type TOrgNrField = TypeFromInterface<IOrgNrField>;

export class OrgNrField extends TextField<TOrgNrField> implements TOrgNrField {
  readonly __implements__ = [IOrgNrField, ITextField, IBaseField];

  async validate(inp, options = undefined, context = undefined): Promise<TFieldError | undefined> {
    const err = await super.validate(inp, options, context);
    if (err) return err;

    // Required has been checked so if it is empty it is ok
    if (!inp) {
      return;
    }

    try {
      var error = _validateOrgNr(inp);
    } catch (e) {
      return {
        type: 'value_error',
        i18nLabel: i18n('isomorphic-schema--org_nr_field_incorrect_formatting', 'Malformatted'),
        message: "Inmatat organisations-/personnummer har något seriöst fel"
      };
    } finally {
      if (error?.message) {
        return {
          type: 'value_error',
          i18nLabel: error.i18nLabel,
          message: error.message
        };
      }
    }

    return;
  }

  toFormattedString(inp) {
    if (inp) {
      var tmp = inp.match(/.{1,8}/g)
      var outp = tmp.join('-');
      return (outp.length === 8 ? outp + '-' : outp)
    } else {
      return
    }
  }

  fromString(inp) {
    var tmp = inp.replace(/([^0-9]*)/g, '')
    if (tmp.length > 12) {
      tmp = tmp.split("")
      tmp = tmp.splice(0, 12)
      tmp = tmp.join("")
    }
    return tmp
  }
}

function _validateOrgNr(inp) {
  /*
         8  1 1 2 1 8  9 8  7 6
      *  2  1 2 1 2 1  2 1  2 1
      -------------------------
         ^  ^ ^ ^ ^ ^  ^ ^  ^ 
        16  1 2 2 2 8 18 8 14 6
  
      1+6+1+2+2+2+8+1+8+8+1+4+6 = 50
  */

  var inpLst = inp.split("")
  if (inpLst.length < 12) {
    return {
      i18nLabel: i18n('isomorphic-schema--org_nr_field_too_short', 'Entered number is too short'),
      message: "Inmatat nummer är för kort"
    }
  }

  var luhLst = [0, 0, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1]
  var calcLst = luhLst.map(function (val, i) {
    return luhLst[i] * parseInt(inpLst[i])
  })
  var tmp = 0
  calcLst.map(function (val) {
    tmp += (val % 10) + Math.floor(val / 10)
  })
  if (tmp % 10 == 0) {
    return undefined
  } else {
    return {
      i18nLabel: i18n('isomorphic-schema--org_nr_field_wrong_checksum', 'The entered number is incorrect (checksum error)'),
      message: "Kontrollsiffran stämmer inte"
    }
  }
}
