/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type PictureGuideCreateFormInputValues = {
    title?: string;
    active?: string;
    imgURL?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type PictureGuideCreateFormValidationValues = {
    title?: ValidationFunction<string>;
    active?: ValidationFunction<string>;
    imgURL?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PictureGuideCreateFormOverridesProps = {
    PictureGuideCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    active?: PrimitiveOverrideProps<SelectFieldProps>;
    imgURL?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PictureGuideCreateFormProps = React.PropsWithChildren<{
    overrides?: PictureGuideCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: PictureGuideCreateFormInputValues) => PictureGuideCreateFormInputValues;
    onSuccess?: (fields: PictureGuideCreateFormInputValues) => void;
    onError?: (fields: PictureGuideCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PictureGuideCreateFormInputValues) => PictureGuideCreateFormInputValues;
    onValidate?: PictureGuideCreateFormValidationValues;
} & React.CSSProperties>;
export default function PictureGuideCreateForm(props: PictureGuideCreateFormProps): React.ReactElement;
