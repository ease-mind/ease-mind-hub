import { JSX } from "react";
import { Chip } from "@mui/material";
import { useTheme } from "@repo/utils";

export interface EasemindChipProps {
  label: string;
  onClick?: () => void;
}

export function EasemindChip({
  label,
  onClick,
}: EasemindChipProps): JSX.Element {
  const { colors } = useTheme();

  return (
    <Chip
      sx={{
        bgcolor: colors["coral.100"],
        maxWidth: 135,
        "&:hover": {
          color: colors["coral.800"],
          bgcolor: colors["coral.300"],
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
