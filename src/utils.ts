
/**
 * 
 * This is a simple deep clone method that doesn't handle circular references
 * but is fast and skinny. It is used internally to clone options.
 * Added it to keep package small.
 * 
 */
function cloneArray (arr) {
    var outp = []
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i]
      if (Array.isArray(item)) {
        outp.push(cloneArray(item))
      } else if (typeof item === 'object') {
          var tmp = clone(item)
          outp.push(tmp)
      } else {
          outp.push(item)
      }
    }    
    return outp
}

const EMPTY_FUNC = function () {}
function _getClonedBaseFunc (obj) {
  var fn = EMPTY_FUNC
  fn.prototype = obj.prototype
  return new fn()
}

// TODO: Handle Date objects?
export function clone(obj) {
    var outp = _getClonedBaseFunc(obj)
    
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      var tmp = obj[key]
      if (Array.isArray(tmp)) {
          outp[key] = cloneArray(tmp)
      } else if (typeof tmp === 'object') {
          outp[key] = clone(tmp)
      } else {
          outp[key] = tmp
      }
    }
    return outp
}

export function cloneShallow(obj) {
  var outp = _getClonedBaseFunc(obj)
    
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      outp[key] = obj[key]
    }
    return outp
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
export function i18n(i18nKey, helpText) {
    return i18nKey
}

const regex = /\${([^}]+)}/g
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
// TODO: Optimise this
export function renderString(str, fieldDef) {
    var m
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++
        }
        
        // The result can be accessed through the `m`-variable.
        m.forEach(function (match, groupIndex) {
            if (fieldDef[match] || fieldDef['_' + match]) {
                str = str.replace('${' + match + '}', fieldDef[match] || fieldDef['_' + match] )
            }
        })
    }
    return str
}

export function isNullUndefEmpty(inp: any) {
    return  inp === undefined || inp === null || inp === '';
}
