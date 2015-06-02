# Isomorphic Schema

Schema definition library with nested field validation. Field validators use object prototype mechanism from [component-registry](https://github.com/jhsware/SimpleJSRegistry "SimpleJSRegistry").

For more examples, please check out the tests.

Sample usage:

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
