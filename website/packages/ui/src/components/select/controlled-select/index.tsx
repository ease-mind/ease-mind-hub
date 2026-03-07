import React from 'react';
import { Controller, RegisterOptions, useFormContext, Control } from 'react-hook-form';
import { SelectOption, EasemindSelect } from '../select';

interface ControlledSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  rules?: RegisterOptions;
  control?: Control<any>;
  color:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
}

export const EasemindSelectController: React.FC<ControlledSelectProps> = ({
  name,
  label,
  rules,
  options,
  color,
  control: controlProp,
}) => {
  const formContext = useFormContext();
  const control = controlProp ?? formContext?.control;

  if (!control) {
    throw new Error(
      "EasemindSelectController deve ser usado dentro de um FormProvider ou receber a prop 'control'"
    );
  }

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <EasemindSelect
          value={field.value ?? ''}
          onChange={(value) => field.onChange(value)}
          label={label}
          options={options}
          error={!!error}
          helperText={error?.message}
          color={color}
        />
      )}
    />
  );
};
