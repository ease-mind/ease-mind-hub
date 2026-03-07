import React from "react";
import { Controller, useFormContext, RegisterOptions, Control } from "react-hook-form";
import { EasemindInput } from "../input";

interface ControlledInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  mask?: "currency";
  rules?: RegisterOptions;
  color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | "black"
    | "white";
  control?: Control<any>;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const EasemindInputController: React.FC<ControlledInputProps> = ({
  control: controlProp,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  mask,
  rules,
  color,
  onBlur
}) => {
  const formContext = useFormContext();
  const control = controlProp ?? formContext?.control;

  if (!control) {
    throw new Error(
      "EasemindInputController deve ser usado dentro de um FormProvider ou receber a prop 'control'"
    );
  }

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <EasemindInput
          {...field}
          label={label}
          type={type}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          autoComplete={autoComplete}
          mask={mask}
          color={color}
          onBlur={(e) => {
            field.onBlur();
            if (onBlur) onBlur(e);
          }}
        />
      )}
    />
  );
};
