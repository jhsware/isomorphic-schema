
import { BaseField } from './BaseField'
import { i18n, isNullUndefEmpty } from '../utils'
import { IBaseField, IListField, OmitInContructor } from '../interfaces'
import { TFieldError, TFormErrors, TValidationOptions } from '../schema';


/*

    A Select Field allows you to choose a single value from a selection

    valueType: TextField,
    options: [{name: "1", title: "First"}]

*/

// TODO: Write tests

type TListField = Omit<IListField, 'interfaceId' | 'providedBy'>;

export class ListField<T = TListField> extends BaseField<T> implements TListField {
    readonly __implements__ = [IListField];
    fieldType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;
    minItems?: number;
    maxItems?: number;
    objectFactoryName: string;

    constructor({ required = false, readOnly = false, fieldType, minItems = undefined, maxItems = undefined, objectFactoryName = undefined }:
        Omit<TListField, OmitInContructor>) {
        super({ required, readOnly });
        this.fieldType = fieldType;
        this.minItems = minItems;
        this.maxItems = maxItems;
        this.objectFactoryName = objectFactoryName
    }

    async validate(
        inp: any[] | undefined,
        options: TValidationOptions = {
            skipInvariants: false, selectFields: [], omitFields: [], objectPath: []
        },
        context: any): Promise<TFieldError | undefined> {
        const err = await super.validate(inp, options, context);
        if (err) return err;

        // Required has been checked so if it is empty it is ok
        if (isNullUndefEmpty(inp)) {
            return;
        }

        // Check that this is an array
        if (!Array.isArray(inp)) {
            return {
                type: 'type_error',
                i18nLabel: i18n('isomorphic-schema--list_field_type_error', 'This is not a proper list. This is a bug in the application'),
                message: "This is not a proper list. This is a bug in the application"
            }
        }

        if (this.maxItems && inp.length > this.maxItems) {
            return {
                type: 'value_error',
                i18nLabel: i18n('isomorphic-schema--list_field_value_error_too_many_items', 'Too many items in list, max ${maxItems} allowed'),
                message: 'Too many items in list, max ${maxItems} allowed'
            }
        }

        if (this.minItems && inp.length < this.minItems) {
            return {
                type: 'value_error',
                i18nLabel: i18n('isomorphic-schema--list_field_value_error_too_few_items', 'Too few items in list, min ${minItems} allowed'),
                message: 'Too few items in list, min ${minItems} allowed'
            }
        }

        const validationPromises = inp.map((item, i) => {
            // Make sure we have a new options object with updated objectPath
            const newOptions = {
                ...options,
                objectPath: [...options.objectPath, i]
            };
            return this.fieldType
                .validate(item, newOptions, context)
        });

        const tmpErrors = await Promise.all(validationPromises);

        const tmpEntries = tmpErrors
            // Create entries
            .map((err, i) => [i, err])
            // Remove validations that passed
            .filter(([i, err]) => err)
        
        if (tmpEntries.length > 0) {
            return {
                type: 'list_error',
                i18nLabel: i18n('isomorphic-schema--list_field_value_error', 'There is an error in the content of this list'),
                message: "There is an error in the content of this list",
                errors: Object.fromEntries(tmpEntries),
            }
        }
        
        return;
    }

    toFormattedString(inp) {
        return inp.toString();
    }

    fromString(inp, options) {
        return inp?.map?.((item) => this.fieldType.fromString(item, options));
    }
}
