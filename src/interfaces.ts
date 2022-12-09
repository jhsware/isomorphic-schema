import { createIdFactory, ObjectInterface } from 'component-registry'
import { Schema, TFieldError, TFormErrors } from './schema';
const id = createIdFactory('isomorphic-schema');

export type OmitInContructor = 'validate' | 'toFormattedString' | 'fromString';

export class IBaseField extends ObjectInterface {
    get interfaceId() { return id('IBaseField') };
    required?: boolean;
    readOnly?: boolean;
    validate(inp: any, options?: any, context?: any): Promise<TFieldError | undefined> { return };
    fromString(inp: string, options?: object): any { };
    toFormattedString(inp: any): string { return '' };
}

export class ITextField extends IBaseField {
    get interfaceId() { return id('ITextField') };
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
}

export class ITextAreaField extends ITextField {
    get interfaceId() { return id('ITextAreaField') };
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
}

export class IIntegerField extends IBaseField {
    get interfaceId() { return id('IIntegerField') };
    min?: number;
    max?: number;
}

export class IDecimalField extends IBaseField {
    get interfaceId() { return id('IDecimalField') };
    min?: number;
    max?: number;
    precision?: number;
}

export class IBoolField extends IBaseField {
    get interfaceId() { return id('IBoolField') };
}

export class ICreditCardField extends IBaseField {
    get interfaceId() { return id('ICreditCardField') };
    cardValidationOptions?: object;
}

export class IDateField extends IBaseField {
    get interfaceId() { return id('IDateField') };
}

export class IDateTimeField extends IBaseField {
    get interfaceId() { return id('IDateTimeField') };
    timezoneAware?: boolean;
}

export class IEmailField extends ITextField {
    get interfaceId() { return id('IEmailField') };
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
}

export class ITelephoneField extends IBaseField {
    get interfaceId() { return id('ITelephoneField') };
}

export class IListField extends IBaseField {
    get interfaceId() { return id('IListField') };
    valueType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;
    minItems?: number;
    maxItems?: number;
    objectFactoryName?: string;
}

export class IObjectField extends IBaseField {
    get interfaceId() { return id('IObjectField') };
    schema: Schema<any>;
    objectFactoryName?: string;
}

export class IObjectRelationField<T = any> extends IBaseField {
    get interfaceId() { return id('IObjectRelationField') };
    // resolverName: string;
    // interface: ObjectInterface;
    // TODO: Create object relation type
    async validate(inp: T, options = undefined, context = undefined): Promise<TFieldError | undefined> { return };
}

export class IOrgNrField extends IBaseField {
    get interfaceId() { return id('IOrgNrField') };
}

export class IPasswordField extends IBaseField {
    get interfaceId() { return id('IPasswordField') };
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
}

export type TSelectFieldOption = { name: string, label: string };
export class ISelectField extends IBaseField {
    get interfaceId() { return id('ISelectField') };
    valueType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;
    options: TSelectFieldOption[];
    getOptionLabel(inp: string): string { return '' };
}
export class ISelectFieldAsync extends IBaseField {
    get interfaceId() { return id('ISelectField') };
    valueType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;
    async getOptions(): Promise<TSelectFieldOption[]> { return [] };
    async getOptionLabel(inp: string): Promise<string> { return '' };
}

export class IMultiSelectField extends IBaseField {
    get interfaceId() { return id('IMultiSelectField') };
    valueType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;
    options: TSelectFieldOption[];
    validate(inp: string[], options?: any, context?: any): Promise<TFieldError | undefined> { return };
    getOptionLabel(inp: string): string { return '' };
}

/* Richtext HTML field */
export class IHTMLAreaField extends IBaseField {
    get interfaceId() { return id('IHTMLAreaField') };
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
}

export class IAnyOf extends IBaseField {
    get interfaceId() { return id('IAnyOf') };
    valueTypes: Omit<IBaseField, 'interfaceId' | 'providedBy'>[];
}
