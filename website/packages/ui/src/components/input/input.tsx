import { Box, TextField } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField";
import { useId } from "react";
import "./style.scss";

declare module "@mui/material/TextField" {
  interface TextFieldPropsColorOverrides {
    tertiary: true;
    black: true;
    white: true;
  }
}

export type EasemindInputProps = Omit<TextFieldProps, "onChange" | "value"> & {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  autoComplete?: string;
  mask?: "currency";
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
  variant?: "contained" | "text" | "outlined";
};

function formatCurrency(value: string) {
  // Verifica se o valor já é um número com ponto decimal
  const number = parseFloat(value);

  if (isNaN(number)) return "";

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function EasemindInput({
  value,
  onChange,
  label,
  type = "text",
  placeholder,
  error = false,
  helperText = "",
  autoComplete = "",
  mask,
  color,
  id,
  ...props
}: EasemindInputProps) {
  const reactId = useId();
  const inputId = id || `input-${reactId}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (mask === "currency") {
      const onlyDigits = newValue.replace(/\D/g, "");
      const reais = onlyDigits === "" ? "" : (Number(onlyDigits) / 100).toFixed(2);
      onChange(reais);
      return;
    }

    onChange(newValue);
  };

  const displayValue =
    mask === "currency" && typeof value === "string"
      ? formatCurrency(value)
      : value || "";

  return (
    <Box className="easemind-input">
      <TextField
        {...props}
        id={inputId}
        value={displayValue}
        onChange={handleChange}
        label={label}
        type={type}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        autoComplete={autoComplete}
        margin="normal"
        variant="outlined"
        fullWidth
        color={color}
        aria-describedby={helperId}
      />
    </Box>
  );
}
