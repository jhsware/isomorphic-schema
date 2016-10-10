# Isomorphic Schema

Schema definition library with nested field validation. Field validators use object prototype mechanism from [component-registry](https://github.com/jhsware/SimpleJSRegistry "SimpleJSRegistry").

For more examples, please check out the tests.

### i18n ###
isomorphic-schema supports i18n by providing i18nLabel propoerties that you can translate with your library of choice. There are two useful helper methods.

Use `i18n` to create nice i18n labels when defining your schema. All it does is return the first argument, but it also allows you to parse your code to find i18n messages to translate. You will need to translate the message with your chosen i18n library:

```
    description: validators.textAreaField({
        label: i18n('form_description_label', 'Description'),
        placeholder: i18n('form_description_placeholder', 'Type here...'),
        required: true
    })
```

Use `renderString` to substitute placeholders for values from the field validator options:

```
    var fieldDef = validators.integerField({
        min: 10,
        max: 20
    })

    var outp = renderString('Value too low. Min ${minValue}', fieldDef)
    // outp === 'Value too low. Min 10'
```

#### Extracting i18n strings ####
You can use grep to extract all the i18n strings you have in your project.

```
grep -ohr "i18n([^)]*)" ./path/to/your/code/*
```

When running this command on isomorphic-schema we get the following output (note, we added a prefix to avoid some comments etc):

```
$ grep -ohr "i18n('isomorphic-schema[^)]*)" ./lib/*
i18n('isomorphic-schema--field_required', 'Required')
i18n('isomorphic-schema--text_field_no_string', 'The field doesn\'t contain text')
i18n('isomorphic-schema--text_field_too_short', 'The text is too short. Min ${minLength} chars.')
i18n('isomorphic-schema--text_field_too_long', 'The text is too long. Max ${maxLength} chars.')
i18n('isomorphic-schema--text_area_field_no_string', 'The field doesn\'t contain text')
i18n('isomorphic-schema--integer_field_not_number', 'The field doesn\'t contain numbers')
i18n('isomorphic-schema--integer_field_no_decimals', 'The field may not contain decimals')
i18n('isomorphic-schema--integer_field_too_small', 'The value is too small. Min ${minValue}')
i18n('isomorphic-schema--integer_field_too_big', 'The value is too big. Max ${maxValue}')
i18n('isomorphic-schema--decimal_field_not_number', 'The field doesn\'t contain numbers')
i18n('isomorphic-schema--decimal_field_too_small', 'The value is too small. Min ${minValue}')
i18n('isomorphic-schema--decimal_field_too_big', 'The value is too big. Max ${maxValue}')
i18n('isomorphic-schema--credit_card_field_not_supported', 'Entered card type is not supported')
i18n('isomorphic-schema--credit_card_field_incorrect_formatting', 'The card number is incorrectly entered')
i18n('isomorphic-schema--date_field_incorrect_formatting', 'This doesn\'t look like a date')
i18n('isomorphic-schema--date_time_field_incorrect_formatting', 'This doesn\'t look like a date with time')
i18n('isomorphic-schema--email_field_incorrect_formatting', 'This is not a valid e-mail address')
i18n('isomorphic-schema--list_field_type_error', 'This is not proper list. This is a bug in the application')
i18n('isomorphic-schema--list_field_value_error', 'There is an error in the content of this list')
i18n('isomorphic-schema--multi_select_field_value_error', 'One or more of the selected values is not allowed')
i18n('isomorphic-schema--object_field_value_error', 'There is an error in the content of this object')
i18n('isomorphic-schema--org_nr_field_incorrect_formatting', 'Malformatted')
i18n('isomorphic-schema--org_nr_field_too_short', 'Entered number is too short')
i18n('isomorphic-schema--org_nr_field_wrong_checksum', 'The entered number is incorrect (checksum error)
i18n('isomorphic-schema--password_field_too_short', 'The password must contain at least 8 chars')
i18n('isomorphic-schema--select_field_value_error', 'The selected value is not allowed')
```

You will want to translate these strings in your project to i18n isomorphic-schema.

### Sample usage ###

```
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