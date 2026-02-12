import { JSX } from "react";
import { Chip } from "@mui/material";
import { useTheme } from "@repo/utils";

export interface EaseMindChipProps {
  label: string;
  onClick?: () => void;
}

export function EaseMindChip({
  label,
  onClick,
}: EaseMindChipProps): JSX.Element {
  const { colors } = useTheme();

  return (
    <Chip
      sx={{
        bgcolor: colors["lime.100"],
        maxWidth: 135,
        "&:hover": {
          color: colors["lime.800"],
          bgcolor: colors["lime.300"],
          cursor: "pointer",
        },
        "& .MuiChip-label": {
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }}
      label={label}
      onClick={onClick}
    />
  );
}
