import React from "react";
import { Box, IconButton } from "@mui/material";
import {
  ArrowBackIosNewRounded,
  ArrowForwardIosRounded,
} from "@mui/icons-material";
export interface EasemindNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  disabled: boolean;
  size?: "inherit" | "large" | "medium" | "small";
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
}

export const EasemindNavigation: React.FC<EasemindNavigationProps> = ({
  onPrev,
  onNext,
  size = "large",
  color = "primary",
  disabled,
}) => {

  if (disabled) return null

  return (
    <Box display="flex" gap={1}>
      <IconButton
        onClick={onPrev}
        size="medium"
        sx={{
          borderRadius: "50%",
          bgcolor: "background.paper",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <ArrowBackIosNewRounded fontSize={size} color={color}  sx={{ fontSize: 20 }}/>
      </IconButton>

      <IconButton
        onClick={onNext}
        size="medium"
        sx={{
          borderRadius: "50%",
          bgcolor: "background.paper",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <ArrowForwardIosRounded fontSize={size} color={color} sx={{ fontSize: 20 }}/>
      </IconButton>
    </Box>
  );
};
