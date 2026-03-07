import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { useId } from "react";
import "./style.scss";
import { useTheme } from "@repo/utils";

export type EasemindDatePickerProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  id?: string;
  disableFuture?: boolean;
  disablePast?: boolean;
  views?: ("year" | "month" | "day")[];
  format?: string;
};

export function EasemindDatePicker({
  value,
  onChange,
  label,
  minDate,
  maxDate,
  disabled = false,
  error = false,
  helperText = "",
  id,
  disableFuture,
  disablePast,
  views,
  format = "dd/MM/yyyy",
}: EasemindDatePickerProps) {
  const reactId = useId();
  const datepickerId = id || `datepicker-${reactId}`;
  const helperId = helperText ? `${datepickerId}-helper` : undefined;
  const { colors } = useTheme();

  return (
    <Box className="easemind-datepicker">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <MuiDatePicker
          label={label}
          value={value}
          onChange={onChange}
          format={format}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          disableFuture={disableFuture}
          disablePast={disablePast}
          views={views}
          sx={{
            ".MuiSvgIcon-root": {
              color: colors["coral.contrast"],
            },
          }}
          slotProps={{
            textField: {
              id: datepickerId,
              fullWidth: true,
              error,
              helperText,
              margin: "normal",
              "aria-describedby": helperId,
            },
            day: {
              sx: {
                color: colors["coral.contrast"],
                fontWeight: 500,
                "&.Mui-selected": {
                  "&:hover": {
                    backgroundColor: colors["coral.contrast"],
                    color: colors["coral.50"],
                  },
                },
                "&:hover": {
                  backgroundColor: colors["coral.subcontrast"],
                  color: colors["white.main"],
                },
                "&.Mui-disabled": {
                  color: colors["grey.500"],
                },
                "&.MuiPickersDay-today": {
                  border: `1px solid ${colors["coral.900"]}`,
                },
              },
            },
            calendarHeader: {
              sx: {
                color: colors["coral.contrast"],
                "& .MuiSvgIcon-root": {
                  color: colors["coral.contrast"],
                },
                "& .MuiPickersCalendarHeader-label": {
                  fontWeight: 600,
                },
                ".MuiDayCalendar-header": {
                  background: "red",
                },
              },
            },
            popper: {
              sx: {
                ".MuiDayCalendar-header": {
                  backgroundColor: colors["coral.500"],
                },
                ".MuiPickersPopper-paper": {
                  backgroundColor: colors["grey.900"],
                  color: colors["coral.contrast"],
                  borderRadius: 2,
                },
                ".MuiDayCalendar-weekDayLabel": {
                  color: colors["coral.subcontrast"],
                  fontWeight: "bold",
                },
              },
            },
            toolbar: {
              sx: {
                backgroundColor: colors["background.gradient"],
                color: colors["coral.highcontrast"],
                "& .MuiTypography-root": {
                  color: colors["coral.highcontrast"],
                  fontWeight: 600,
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
}
