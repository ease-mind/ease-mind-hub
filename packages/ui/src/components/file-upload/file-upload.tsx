import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import { styled } from "@mui/material/styles";
import { useTheme } from "@repo/utils";
import Typography from "@mui/material/Typography";
import InsertDriveFileTwoToneIcon from "@mui/icons-material/InsertDriveFileTwoTone";
import { Box, Button } from "@mui/material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface EaseMindButtonFileUploadProps {
  label: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
}

export function EaseMindButtonFileUpload({
  label,
  value,
  onChange,
}: EaseMindButtonFileUploadProps) {
  const { colors, isDarkMode } = useTheme();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (onChange) onChange(file);
  };

  return (
    <>
      <Button
        component="label"
        variant="outlined"
        sx={{
          fontSize: "1rem",
          color: colors["grey.500"],
          fontWeight: "regular",
          border: isDarkMode
            ? "dotted 2px rgba(255,255,255,0.1)"
            : "dotted 2px rgba(0,0,0,0.1)",
          width: "100%",
          textTransform: "none",
          "&:hover": {
            color: colors["lime.700"],
            bgcolor: colors["lime.100"],
            cursor: "pointer",
          },
        }}
        tabIndex={-1}
        startIcon={<PublishRoundedIcon />}
      >
        {value ? "ARQUIVO SELECIONADO" : label}
        <VisuallyHiddenInput type="file" accept=".png, .jpeg, .jpg, .pdf" onChange={handleFileChange} />
      </Button>

      {value && (
        <Box display="flex" marginTop="0.5rem" alignItems="center" gap="6px">
          <InsertDriveFileTwoToneIcon color="secondary" fontSize="small" />
          <Typography variant="body2" sx={{ color: colors["grey.800"] }}>
            {value.name}
          </Typography>
        </Box>
      )}
    </>
  );
}