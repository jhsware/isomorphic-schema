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