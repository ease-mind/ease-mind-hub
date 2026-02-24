import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@repo/utils";

interface EaseMindAutoCompleteProps {
  loading: boolean;
  options: { label: string; value: string }[];
  label: string;
  value: { label: string; value: string } | null;
  onChange: (value: { label: string; value: string } | null) => void;
  onCreateOption?: (label: string) => Promise<void>;
  error?: boolean;
  helperText?: string;
}

export function EaseMindAutoComplete({
  options,
  loading,
  label,
  error,
  helperText,
  value,
  onChange,
  onCreateOption,
}: EaseMindAutoCompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const { colors } = useTheme();

  const handleBlur = async () => {
    const exists = options.some(
      (opt) => opt.label.toLowerCase() === inputValue.toLowerCase(),
    );
    if (inputValue && !exists && onCreateOption) {
      await onCreateOption(inputValue);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const exists = options.some(
        (opt) => opt.label.toLowerCase() === inputValue.toLowerCase(),
      );
      if (inputValue && !exists && onCreateOption) {
        await onCreateOption(inputValue);
      }
    }
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, val) => option.value === val?.value}
      getOptionLabel={(option) => option.label}
      options={options}
      loading={loading}
      value={value}
      onChange={(_, val) => {
        onChange(val);
        setInputValue("");
      }}
      sx={{
        ".MuiSvgIcon-root": {
          color: colors["coral.highcontrast"],
        },
      }}
      inputValue={inputValue}
      onInputChange={(_, val) => setInputValue(val)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
