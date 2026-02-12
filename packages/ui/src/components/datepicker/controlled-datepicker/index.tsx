import React from "react";
import { Controller, useFormContext, RegisterOptions } from "react-hook-form";
import { EaseMindDatePicker } from "../datepicker";

interface ControlledDatePickerProps {
  name: string;
  label: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  rules?: RegisterOptions;
  disableFuture?: boolean;
  disablePast?: boolean;
  views?: ('year' | 'month' | 'day')[];
  format?: string;
  id?: string;
}


export const EaseMindDatePickerController: React.FC<ControlledDatePickerProps> = ({
  name,
  label,
  minDate,
  maxDate,
  disabled,
  rules,
  disableFuture,
  disablePast,
  views,
  format,
  id,
}) => {
  const { control } = useFormContext();
  
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <EaseMindDatePicker
          id={id}
          label={label}
          value={field.value === undefined ? null : field.value}
          onChange={(date) => {
            field.onChange(date);
          }}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          error={!!error}
          helperText={error?.message}
          disableFuture={disableFuture}
          disablePast={disablePast}
          views={views}
          format={format}
        />
      )}
    />
  );
};
