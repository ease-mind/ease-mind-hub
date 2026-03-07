import {
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  SelectProps,
  Select,
  CircularProgress,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@repo/utils";
import { useId } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export type EasemindSelectProps = SelectProps & {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onOpen?: (value: string) => void;
  label: string;
  options: SelectOption[];
  error?: boolean;
  helperText?: string;
  loading?: boolean;
  multiple?:boolean;
  /**
   * As cores do select
   */
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
};

export function EasemindSelect({
  value,
  onChange,
  onOpen,
  label,
  options,
  error = false,
  helperText = "",
  color,
  multiple,
  loading = false,
}: EasemindSelectProps) {
  const reactId = useId();
  const selectId = `select-${reactId}`;
  const {colors} = useTheme();

  return (
    <FormControl variant="outlined" fullWidth margin="normal" error={error}>
      <InputLabel id={`${selectId}-label`} htmlFor={selectId}>
        {label}
      </InputLabel>
      <Select
        id={selectId}
        labelId={`${selectId}-label`}
        value={value ?? ""}
        onOpen={onOpen}
        onChange={(e: any) => onChange(e.target.value)}
        label={label}
        color={color}
        aria-describedby={helperText ? `${selectId}-helper` : undefined}
        multiple={multiple}
        sx={{
          ".MuiSvgIcon-root": {
            color: colors["coral.highcontrast"]
          }
        }}
      >
        {loading ? (
          <MenuItem disabled>
            <ListItemText primary="Carregando..." />
            <CircularProgress size={20} style={{ marginLeft: 10 }} />
          </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        )}
      </Select>
      {helperText && (
        <FormHelperText id={`${selectId}-helper`}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}
