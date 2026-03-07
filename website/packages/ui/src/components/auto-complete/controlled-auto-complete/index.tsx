import React from "react";
import { Controller, useFormContext, RegisterOptions } from "react-hook-form";
import { EasemindAutoComplete } from "../auto-complete";

interface OptionType {
  label: string;
  value: string;
}

interface EasemindAutoCompleteControllerProps {
  name: string;
  label: string;
  loading?: boolean;
  options: OptionType[];
  rules?: RegisterOptions;
  onCreateOption?: (label: string) => Promise<void>;
}

export const EasemindAutoCompleteController: React.FC<EasemindAutoCompleteControllerProps> = ({
  name,
  label,
  loading = false,
  options,
  rules,
  onCreateOption,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedOption =
          options.find((option) => option.value === field.value) || null;

        return (
          <EasemindAutoComplete
            label={label}
            loading={loading}
            options={options}
            value={selectedOption}
            onChange={(val) => field.onChange(val?.value || "")}
            onCreateOption={onCreateOption}
            error={!!error}
            helperText={error?.message}
          />
        );
      }}
    />
  );
};
