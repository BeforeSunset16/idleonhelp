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
export declare type PictureGuideUpdateFormInputValues = {
    title?: string;
    active?: string;
    imgURL?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type PictureGuideUpdateFormValidationValues = {
    title?: ValidationFunction<string>;
    active?: ValidationFunction<string>;
    imgURL?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PictureGuideUpdateFormOverridesProps = {
    PictureGuideUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    title?: PrimitiveOverrideProps<TextFieldProps>;
    active?: PrimitiveOverrideProps<SelectFieldProps>;
    imgURL?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PictureGuideUpdateFormProps = React.PropsWithChildren<{
    overrides?: PictureGuideUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    pictureGuide?: any;
    onSubmit?: (fields: PictureGuideUpdateFormInputValues) => PictureGuideUpdateFormInputValues;
    onSuccess?: (fields: PictureGuideUpdateFormInputValues) => void;
    onError?: (fields: PictureGuideUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PictureGuideUpdateFormInputValues) => PictureGuideUpdateFormInputValues;
    onValidate?: PictureGuideUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PictureGuideUpdateForm(props: PictureGuideUpdateFormProps): React.ReactElement;
