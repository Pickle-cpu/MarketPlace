/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type BasicHHCreateFormInputValues = {
    name?: string;
    description?: string;
};
export declare type BasicHHCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BasicHHCreateFormOverridesProps = {
    BasicHHCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BasicHHCreateFormProps = React.PropsWithChildren<{
    overrides?: BasicHHCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: BasicHHCreateFormInputValues) => BasicHHCreateFormInputValues;
    onSuccess?: (fields: BasicHHCreateFormInputValues) => void;
    onError?: (fields: BasicHHCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BasicHHCreateFormInputValues) => BasicHHCreateFormInputValues;
    onValidate?: BasicHHCreateFormValidationValues;
} & React.CSSProperties>;
export default function BasicHHCreateForm(props: BasicHHCreateFormProps): React.ReactElement;
