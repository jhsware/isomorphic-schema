import { createInterfaceDecorator, ObjectInterface } from 'component-registry'
import { Schema, TFieldError, TFormErrors } from './schema';
const Interface = createInterfaceDecorator('isomorphic-schema');

export type OmitInContructor = 'validate' | 'toFormattedString' | 'fromString';

@Interface
export class IBaseField extends ObjectInterface {
    required?: boolean;
    readOnly?: boolean;
    label?: string;
    placeholder?: string;
    help?: string;
    validate(inp: any, options?: any, context?: any): Promise<TFieldError | undefined> { return };
    fromString(inp: string, options?: object): any { };
    toFormattedString(inp: any): string { return '' };
}

@Interface
export class ITextField extends IBaseField {
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
}

@Interface
export class ITextAreaField extends ITextField {
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
}

@Interface
export class IIntegerField extends IBaseField {
    min?: number;
    max?: number;
}

@Interface
export class IDecimalField extends IBaseField {
    min?: number;
    max?: number;
    precision?: number;
}

@Interface
export class IBoolField extends IBaseField { }

@Interface
export class ICreditCardField extends IBaseField {
    cardValidationOptions?: object;
}

@Interface
export class IDateField extends IBaseField { }

@Interface
export class IDateTimeField extends IBaseField {
    timezoneAware?: boolean;
}

@Interface
export class IEmailField extends ITextField {
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
}

@Interface
export class ITelephoneField extends IBaseField { }

@Interface
export class IListField extends IBaseField {
    valueType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;
    minItems?: number;
    maxItems?: number;
    objectFactoryName?: string;
}

@Interface
export class IObjectField extends IBaseField {
    schema: Schema<any>;
    objectFactoryName?: string;
}

@Interface
export class IObjectRelationField<T = any> extends IBaseField {
    // resolverName: string;
    // interface: ObjectInterface;
    // TODO: Create object relation type
    async validate(inp: T, options = undefined, context = undefined): Promise<TFieldError | undefined> { return };
}

@Interface
export class IOrgNrField extends IBaseField { }

@Interface
export class IPasswordField extends IBaseField {
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
}

export type TSelectFieldOption = { name: string, label: string };
@Interface
export class ISelectField extends IBaseField {
    valueType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;
    options: TSelectFieldOption[];
    getOptionLabel(inp: string): string { return '' };
}
@Interface
export class ISelectFieldAsync extends IBaseField {
    valueType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;
    async getOptions(): Promise<TSelectFieldOption[]> { return [] };
    async getOptionLabel(inp: string): Promise<string> { return '' };
}

@Interface
export class IMultiSelectField extends IBaseField {
    valueType: Omit<IBaseField, 'interfaceId' | 'providedBy'>;
    options: TSelectFieldOption[];
    validate(inp: string[], options?: any, context?: any): Promise<TFieldError | undefined> { return };
    getOptionLabel(inp: string): string { return '' };
}

/* Richtext HTML field */
@Interface
export class IHTMLAreaField extends IBaseField {
    minLength?: number;
    maxLength?: number;
    trim?: boolean;
}

@Interface
export class IAnyOf extends IBaseField {
    valueTypes: Omit<IBaseField, 'interfaceId' | 'providedBy'>[];
}
