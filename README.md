# Isomorphic Schema
[![Build Status](https://travis-ci.org/jhsware/isomorphic-schema.svg?branch=master)](https://travis-ci.org/jhsware/isomorphic-schema)


Isomorphic Javascript form validation library. Supports nested forms, rules for skipping validation of fields and multi-field validation. Has i18n support.

Field validators use object prototype mechanism from [component-registry](https://github.com/jhsware/component-registry "component-registry") to support inheritance.

For more examples, please check out the tests.

## Overview ###

The purpose of the isomorphic-schema form validation package is to help create great user experiences when working with forms and form validation. With simple and readable syntax it both works both as a single source of truth and documentation of forms and/or the complete data model.

You can choose to only use isomorphic-schema to define your forms, you can use it to define your entity objects or you can use it for both.

Chances are you will start by only using it for forms, where one schema matches a single form. However it can also be used to validate data that is stored in a document database such as MongoDB.

By using the component-registry concept of interfaces and object prototypes, it is possible to register widgets to render the form fields. This is very powerful when creating a form rendering library where the form generator is entirely decoupled from the field widget implementations. This is explained a bit more further down.

## Schema ###

A schema contains a collection of named field validators that define a form. The schema also contains methods to allow form level actions such as form validation.

### Creating a Schema ####
To create a schema you make a new instance of the Schema object. There are two required paramters to pass to the constructor:

1 A name used for debugging

2 An object containing named fields

```JavaScript
var Schema = require('isomorphic-schema').Schema;
var validators = require('isomorphic-schema').validators;
var simpleSchema = new Schema("MyThing Schema", {
    title: validators.textField({
        label: 'Title',
        placeholder: 'Type here...',
        required: true
    }),
    author: validators.textField({
        label: 'Author',
        placeholder: 'Type here...',
        required: true
    }) 
})
```

Each field has a field validator that determines what data that field accepts. There are a bunch a fields in isomorphic-schema, but you can easily create your own fields to get custom behaviour.

Besides field validators you can also add form level validation with invariants and validation constraints.

### Inheritance ###
Schema supports inheritance to allow you to compose your forms. Instead of adding the debug name as first parameter you pass an object:

```JavaScript
var compositeSchema = new Schema({ schemaName: "MyComposite Schema", extends: [simpleSchema]}, {
    status: validators.textField({
        label: 'Status',
        placeholder: 'Type here...',
        required: true
    }) 
})
```

The order in your extends array is important. With duplicate fields, schemas to the left override anything to the right. Fields in schemas to the right will be added first so this affects the order if you auto generate forms. Your schema specific fields are placed last.

### Invariants ####
An invariant is a test that returns an an invariant error if doesn't pass. A typical invariant test is that password and confirm_password is a match, or that to_date is larger than from_date.

```JavaScript
simpleSchema.addInvariant(function (data, selectedFields) {
    var tmpFields = ['password', 'confirm_password'];

    // Check that all the fields in this invariant are passed
    for (var i in tmpFields) {
        var key = tmpFields[i];
        if (selectedFields.indexOf(key) < 0) {
            // The fields aren't supplied so we don't do the test
            return
        }
    }
    
    if (data[tmpFields[0]] !== data[tmpFields[1]]) {
        return {
            message: "The passwords don't match!",
            fields: tmpFields
        }
    }
})
```

Note that invariants should only be checked if all the fields are passed in selectedFields. Both data and selectedFields are passed by the simpleSchema.validate method to the invariant validator function.

### Validation Constraints ####

Validation constraints are used to skip validation of one or more fields depending on what the passed data looks like. This is useful if you have large forms where some fields depend on the value of other fields. An example could be that a publish_date field only is validated if the staus field of the object is set to published.

```JavaScript
simpleSchema.addValidationConstraint(function (data, fieldKey) {
    // Don't render or validate author when no title is set
    if (fieldKey === 'author') {
        return data.title ? true : false; 
    } else {
        return true;
    }
})
```

Validation constraints are very nice in browser rendered forms because they allow you to hide fields that only should be shown if the user has entered specific values, such as choosing "other" in a list of options in a questionaire reveals a text field where other is specified.

### Validating Form Data ####

Once you have created an instance of a schema such as `simpleSchema` above you can use it to validate and transform data that you have received from the browser. The validation part checks that the provided input is valid, otherwise returning field level errors that are inteded to be displayed to the user. The transform part makes sure that data is converted to correct data types since the HTML-input fields normally return simple strings.

```JavaScript
var errors = simpleSchema.validate(inputData)
```

When we call validate, the schema calls validate on each field and returns an error object if any data is determined to be invalid.

```JavaScript
var errors = {
    fieldErrors: {
        [field-name]: { [field-error-object] }
    },
    invariantErrors: [
        // list of invariant error objects (validation checks on more than one field at a time, such as 'password' === 'confirmPassword')
    ]
}
```

If the form data passes validation we need transform the form data to proper datatypes, such as integers and real objects, before we can pass it on to our storage mechanism.

```JavaScript
var outp = simpleSchema.transform(inputData)
```

The passed data is converted to proper datatypes by calling the method `fromString` which is available on each field validator. The resulting object can then be sent to an API or a database.

## Field Validators ###

Field validators define what values are valid. This is an overview of the field validators available in the base package. Check the inheritance schema to see what options a field has inherited. 

Overview of field options:

### BaseField
**required:** {boolean} this field is required (must evaluate to `val == true`)

**readOnly:** {boolean} this is a read only field 

### TextField
**minLength:** {integer} minimum number of chars

**maxLength:** {integer} maximum number of chars

### IntegerField, DecimalField
**min:** {integer} minimum value 

**max:** {integer} maximum value

### SelectField, MultiselectField
**valueType:** a validator where the type matches 'name' in options (usually `textField({})`)

**options:** {array} list of option objects of the form {name: string, title: string}

### ObjectField
**schema:** {object} another Schema object

### ListField
**valueType:** {object} a validator that matches the items in the list (can be a simple type such as `textField({})` or `objectField({schema: ...})`)

**minLength:** {integer} minimum number of items

**maxLength:** {integer} maximum number of items

### HTMLAreaField
**minLength:** {integer} minimum number of chars when tags have been removed

**maxLength:** {integer} maximum number of chars when tags have been removed


### Validator Inheritance Hierarchy
```
baseField
    |- decimalField
    |- integerField
    |- textField
    |   |- dateField
    |   |- dateTimeField
    |   |- emailField
    |   |- orgNrField
    |   |- passwordField
    |   |- textAreaField
    |   |- HTMLAreaField
    |- listField
    |- objectField
    |- objectRelationField
    |- multiSelectField
    |- selectField
    |- creditCardField
boolField    
```

## Creating Custom Fields ###

There are three use cases where you will want to create a custom field.

1. You want to allow your form rendering library to render a custom widgets

2. You need to extend the validation rules

3. You need to some transformation of the property in order to render it nicely

### Creating a Dead Simple Field to Enable Custom Widget ####

Since each field is identified by it's interface, we first create one.

```JavaScript
var createInterface = require('component-registry').createInterface;

var IMySpecialField = createInterface({
  name: 'IMySpecialField'
})
module.exports.IMySpecialField = IMySpecialField;
```

**Note:** we need to export the created interface to allow our custom widget to register itself as renderer for this field. 

```JavaScript
var createObjectPrototype = require('component-registry').createObjectPrototype;
var TextField = require('isomorphic-schema').fieldObjectPrototypes.TextField;

var MySpecialField = createObjectPrototype({
  implements: [IMySpecialField],
  extends: [TextField]
  // We don't change any functionality so we don't need to implement any methods
  // to override the inherited TextField behaviour
})
module.exports.mySpecialField = function (options) { return new MySpecialField(options) }
```

This field extends TextField and thus inherits all the functionality of a TextField. Because of this inheritance it also inherits the ITextField interface. If we don't create a custom widget that renders IMySpecialField, this field will be rendered with the widget that renders ITextField.

### Creating a Field With Custom Validation ####

Again you start by creating an interface. 

```JavaScript
var IMySpecialValidationField = createInterface({
  name: 'IMySpecialValidationField'
})
module.exports.IMySpecialValidationField = IMySpecialValidationField;
```

Now we extend a field that has the basic behaviour we need and then add our custom validation.

```JavaScript
var i18n = require('isomorphic-schema').i18n
var MyRegex = /(\d{4}-){3}\d{4}/
var MySpecialValidationField = createObjectPrototype({
  implements: [IMySpecialValidationField],
  extends: [TextField],
  
  validate: function (inp) {
    // Call the TextField validate method to invoke the validation we inherited
    var error = this._ITextField.validate.call(this, inp)
    if (error) { return error }

    // Implement our custom regex validation
    if (inp !== undefined && !(MyRegex.test(inp) && !inp.length === 19)) {
      error = {
        type: 'constraint_error',
        i18nLabel: i18n('isomorphic-schema--my_special_incorrect_formatting', 'The Field must be of form ####-####-####-####'),
        label: 'The Field must be of form ####-####-####-####'
      }

      return error
    }
  }
})
module.exports.mySpecialValidationField = function (options) { return new MySpecialValidationField(options) }
```

Note that createObjectPrototype mounts methods of the extended fields using the interface name of that object prototype. That is why we type `this._ITextField` to access the validate method of the TextField. If we extend from our new MySpecialValidationField we would access it's validate method at `this._IMySpecialValidationField` which is also the name we set on the interface IMySpecialValidationField.

### Creating a Field to Handle Complex Properties ####

Yupp, you start by creating an interface. 

```JavaScript
var IMyComplexValidationField = createInterface({
  name: 'IMyComplexValidationField'
})
module.exports.IMyComplexValidationField = IMyComplexValidationField;
```

In this example we will extend a SelectField in order to update data in an object. We will also force the available select options in the constructor to avoid having to enter that data in the schema. Since we are using the standard SelectField validation we don't need to add a validation method.

```JavaScript
var validators = require('isomorphic-schema').validators;
var SelectField = require('isomorphic-schema').fieldObjectPrototypes.SelectField;

var MyComplexValidationField = createObjectPrototype({
  implements: [IMyComplexValidationField],
  extends: [SelectField],
  
  constructor: function (options) {
    // These are mandatory options so we override what ever crap the developer might have fed us :p
    options.options = [
      // Note that it is up to the form rendering library to choose how to render the title string, the i18n method
      // is a convenience method that allows us to parse our code and find i18n strings that need to be translated.
      // We could just use a simple string as option title if we only use a single language.
      {name: 'happy_strong', title: i18n('form_visibility__option_happy_strong', 'Feeling happy and strong')},
      {name: 'happy_weak', title: i18n('form_visibility__option_happy_weak', 'Feeling happy but weak')},
      {name: 'sad_strong', title: i18n('form_visibility__option_sad_strong', 'Feeling sad but strong')},
      {name: 'sad_weak', title: i18n('form_visibility__option_sad_weak', 'Feeling sad and weak')}
    ]
    options.valueType = validators.textField({required: true})

    this._ISelectField.constructor.call(this, options)
  },

  toFormattedString: function (inp) {
    if (inp.happy && inp.strong) {
        return 'happy_strong';
    } else if (inp.happy) {
        return 'happy_weak';
    } else if (inp.strong) {
        return 'sad_strong';
    } else {
        return 'sad_weak';
    }
  },

  fromString: function (inp) {
    var outp = {
        happy: false,
        strong: false
    };
    if (inp.indexOf('happy') >= 0) {
        outp.happy = true;
    }
    if (inp.indexOf('strong') >= 0) {
        outp.strong = true;
    }
    return outp;
  }
})
module.exports.myComplexValidationField = function (options) { return new MyComplexValidationField(options) }
```

The method `toFormattedString` converts the value sent to the field to a representation used internally in the field. In this case transforming it to be compatible with the SelectField we are extending.

The method `fromString` conversely converts the internal value back to the original object representation.

These two methods allow us great flexibility in what data a field can handle.

## Creating a Form Rendering Library ###

### Creating a Form Renderer ####

Rendering a form from a schema is not very difficult but there are several features you need to make sure you support. If you want to create your own form renderer you should take a look at an existing implementation and make the changes that suit your purpose. For server side template based rendering engines check the NPM-package `kth-node-formlib` https://github.com/KTH/kth-node-formlib and for React style isomorphic form rendering look at `protoncms-formlib` https://github.com/jhsware/protoncms-formlib

### Creating a Field Widget ####

The form generator will do a lookup to find the widget it should render for a given field. This lookup asks for an adapter that implements an interface (in this case IInputFieldWidget) and adapts the given field (in this case IMySpecialField). The lookup looks like this, but you don't need to worry about that unless you create a form generator:

```JavaScript
var theField = module.exports.mySpecialField; // The field we exported in the create custom fields part
registry.getAdapter(theField, IInputFieldWidget);
```

The component-registry https://github.com/jhsware/component-registry will find the widget we are creating here:

```JavaScript
var MySpecialInputAdapter = createAdapter({
  implements: IInputFieldWidget,
  adapts: IMySpecialField,

  render: function (key, data, fieldError, lang, objectNamespace) {
    // this.context is the field validator object
    var inputName = (objectNamespace ? objectNamespace + '.' + key : key)
    
    // Conveniece method that creates the label of this widget
    var outp = _standardLabel(key, this.context, lang)

    // Always handle readOnly attribute
    if (this.context.readOnly) {
      if (data) {
        outp += '<div class="form-control-static">' + data + '</div>'
      } else {
        let placeholder = (this.context.placeholder ? this.context.placeholder : '')
        outp += '<div class="form-control-static">' + placeholder + '</div>'
      }
      outp += '<input type="hidden" name="' + inputName + '" value="' + (data || '') + '" />'
    } else {
      outp += '<input type="text" class="form-control" value="' + (data || '') + '" name="' + inputName + '" id="' + inputName + '" placeholder="' + (this.context.placeholder ? this.context.placeholder : '') + '" />'
    }

    return outp
  }
})
registry.registerAdapter(MySpecialInputAdapter)
```

The fact that we place the widget rendering code in a render method is determined by the form generator. Also the parameters are determined by the form generator. This example matches `kth-node-formlib`.

## i18n ###
isomorphic-schema supports i18n by providing i18nLabel propoerties that you can translate with your library of choice. There are two useful helper methods i18n and renderString:


### i18n(label: string[, description: string]) ####
Use `i18n` to create nice i18n labels when defining your schema. All it does is return the first argument, but it also allows you to parse your code to find i18n messages to translate. You will need to translate the message with your chosen i18n library when outputing the strings.

```JavaScript
var validators = require('isomorphic-schema').validators
var i18n = require('isomorphic-schema').i18n

description: validators.textAreaField({
    label: i18n('form_description_label', 'Description'),
    placeholder: i18n('form_description_placeholder', 'Type here...'),
    required: true
})
```

### renderString(text: string, fieldeDef: object) ####
Use `renderString` to substitute placeholders for values from the field validator options. This is used in your field widget when rendering a field error.

```JavaScript
var validators = require('isomorphic-schema').validators
var renderString = require('isomorphic-schema').renderString

var fieldDef = validators.integerField({
    min: 10,
    max: 20
})

var outp = renderString('Value too low. Min ${minValue}', fieldDef)
// outp === 'Value too low. Min 10'
```

### Extracting i18n strings ####
You can use grep to extract all the i18n strings you have in your project.

```
grep -ohr "i18n([^)]*)" ./path/to/your/code/*
```

**Note** this regex currently truncates on the first ending parenthesis, if that is a problem you need to create a better regex. 

When running this command on isomorphic-schema we get the following output (note, we added a prefix to avoid some comments etc):

```
// This is a regex that will return two match groups with i18nLabel and description, you can use it to create a js parser
const regex = /i18n\(('[^'"]*'(?=(?:[^"]*"[^"]*")*[^"]*$))[^'"]+('[^'"]*'(?=(?:[^"]*"[^"]*")*[^"]*$))\)/g

// If you only want to a simple extraction from commanline, try this:
$ grep -ohr "i18n(['\"][^'\"]*['\"].*" ./lib/*
i18n('isomorphic-schema--field_required', 'Required'),
i18n('isomorphic-schema--text_field_no_string', 'The field doesn\'t contain text'),
i18n('isomorphic-schema--text_field_too_short', 'The text is too short. Min ${minLength} chars.'),
i18n('isomorphic-schema--text_field_too_long', 'The text is too long. Max ${maxLength} chars.'),
i18n('isomorphic-schema--text_area_field_no_string', 'The field doesn\'t contain text'),
i18n('isomorphic-schema--text_field_too_short', 'The text is too short. Min ${minLength} chars.'),
i18n('isomorphic-schema--text_field_too_long', 'The text is too long. Max ${maxLength} chars.'),
i18n('isomorphic-schema--integer_field_not_number', 'The field doesn\'t contain numbers'),
i18n('isomorphic-schema--integer_field_no_decimals', 'The field may not contain decimals'),
i18n('isomorphic-schema--integer_field_too_small', 'The value is too small. Min ${minValue}'),
i18n('isomorphic-schema--integer_field_too_big', 'The value is too big. Max ${maxValue}'),
i18n('isomorphic-schema--decimal_field_not_number', 'The field doesn\'t contain numbers'),
i18n('isomorphic-schema--decimal_field_too_small', 'The value is too small. Min ${minValue}'),
i18n('isomorphic-schema--decimal_field_too_big', 'The value is too big. Max ${maxValue}'),
i18n('isomorphic-schema--credit_card_field_not_supported', 'Entered card type is not supported');
i18n('isomorphic-schema--credit_card_field_incorrect_formatting', 'The card number is incorrectly entered');
i18n('isomorphic-schema--date_field_incorrect_formatting', 'This doesn\'t look like a date'),
i18n('isomorphic-schema--date_time_field_incorrect_formatting', 'This doesn\'t look like a date with time'),
i18n('isomorphic-schema--email_field_incorrect_formatting', 'This is not a valid e-mail address'),
i18n('isomorphic-schema--list_field_type_error', 'This is not proper list. This is a bug in the application'),
i18n('isomorphic-schema--list_field_value_error_too_many_items', 'Too many items in list, max ${maxItems} allowed'),
i18n('isomorphic-schema--list_field_value_error_too_few_items', 'Too few items in list, min ${minItems} allowed'),
i18n('isomorphic-schema--list_field_value_error', 'There is an error in the content of this list'),
i18n('isomorphic-schema--multi_select_field_value_error', 'One or more of the selected values is not allowed'),
i18n('isomorphic-schema--object_field_value_error', 'There is an error in the content of this object'),
i18n('isomorphic-schema--org_nr_field_incorrect_formatting', 'Malformatted'),
i18n('isomorphic-schema--org_nr_field_too_short', 'Entered number is too short'),
i18n('isomorphic-schema--org_nr_field_wrong_checksum', 'The entered number is incorrect (checksum error)'),
i18n('isomorphic-schema--password_field_too_short', 'The password must contain at least 8 chars'),
i18n('isomorphic-schema--select_field_value_error', 'The selected value is not allowed'),
i18n('form_label_title', 'The Title')
```

You will want to translate these strings in your project to internationalise your forms.

## Sample usage ###

**Note:** These examples don't use i18n enabled strings for readability. Substitute the strings with i18n(...) as shown above to support translations.

```JavaScript
var Schema = require('isomorphic-schema').Schema;
var validators = require('isomorphic-schema').field_validators;

var mediaSchema = new Schema("Media Schema", {
    image_url: validators.textField({
        label: 'Image URL',
        placeholder: 'http://...',
        required: true
    }),
    description: validators.textAreaField({
        label: 'Description',
        placeholder: 'Type here...',
        required: true
    })
});


var myThing = new Schema("MyThing Schema", {
    difficulty: validators.selectField({
        label: 'Difficulty',
        required: true,
        valueType: validators.integerField(),
        options: [
            {name: 0, title: "Easy"},
            {name: 1, title: "Medium"},
            {name: 2, title: "Hard"}
        ]
    }),
    description: validators.textAreaField({
        label: 'Description',
        placeholder: 'Type here...',
        required: true
    }),
    media: validators.listField({
        label: 'Media',
        required: false,
        valueType: validators.objectField({
            label: 'Media File',
            schema: mediaSchema,
            requried: true,
            help: 'Choose a media file...'
        })
    })
});

var errors = mySchema.validate({
    difficulty: 0,
    description: "This is my thing"
});

if (typeof errors === 'undfined') {
    console.log("We didn't get any validation errors!");
}
```

## Internal Notes ###

DONE - explain purpose of isomorphic-schema
DONE - What is a schema and what is a field validator
TODO - What is component-registry
STARTED - Schema API
STARTED - Field validator API
DONE - list field validators with options and common options
    - label
    - type
    - help
DONE - how to create a custom field
DONE - how to creat a formlib to render schemas
    DONE - formGenerator
    DONE - component-registry
    DONE - field widgets


options: { utility: IMyOptionsUtility, name: 'my-name'}

createUtility({
    implements: IMyOptionsUtility,
    name: 'my-name',

    getOptions: function () {
        // Get all the options
        // MUST CACHE VALUES, at least during this request, this could get VERY slow otherwise
        // If it returns a huge data set you should consider creating a specialised validator
        // that doesn't demand fetching data for validation
        return [{name: ..., title: ...}]
    },

    getOptionTitle: function (value) {
        // Get option matching value
        // MUST CACHE VALUES, this could get VERY slow
        return 'The Title'
    }
}) 