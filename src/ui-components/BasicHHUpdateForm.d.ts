/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { BasicHH } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type BasicHHUpdateFormInputValues = {
    name?: string;
    description?: string;
};
export declare type BasicHHUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BasicHHUpdateFormOverridesProps = {
    BasicHHUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BasicHHUpdateFormProps = React.PropsWithChildren<{
    overrides?: BasicHHUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    basicHH?: BasicHH;
    onSubmit?: (fields: BasicHHUpdateFormInputValues) => BasicHHUpdateFormInputValues;
    onSuccess?: (fields: BasicHHUpdateFormInputValues) => void;
    onError?: (fields: BasicHHUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: BasicHHUpdateFormInputValues) => BasicHHUpdateFormInputValues;
    onValidate?: BasicHHUpdateFormValidationValues;
} & React.CSSProperties>;
export default function BasicHHUpdateForm(props: BasicHHUpdateFormProps): React.ReactElement;
