import React from "react";
import { Control, Controller, RegisterOptions, useFormContext } from "react-hook-form";
import { EasemindInput, EasemindInputProps } from "./Input";

interface InputControllerProps extends EasemindInputProps{
  name: string;
  rules?: RegisterOptions;
  control?: Control<any>;
  keyboardType?: EasemindInputProps["keyboardType"];
  fontSize?: EasemindInputProps["fontSize"];
}

export const EasemindInputController: React.FC<InputControllerProps> = ({
  control: controlProp,
  name,
  label,
  type = "text",
  placeholder,
  maskType,
  rules,
  keyboardType,
  secureTextEntry,
  right,
  editable,
  fontSize
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
      render={({ field, fieldState: { error } }) => {
        return <EasemindInput
          {...field}
          label={label}
          type={type}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          keyboardType={keyboardType || 'default'}
          value={field.value}
          maskType={maskType}
          secureTextEntry={secureTextEntry}
          right={right}
          editable={editable}
          fontSize={fontSize}
          onChangeText={
            maskType
              ? (masked) => field.onChange(masked)
              : field.onChange
          }
        />
      }
      }
    />
  );
};