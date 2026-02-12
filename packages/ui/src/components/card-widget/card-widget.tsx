import { Box } from "@mui/material";
import { EaseMindCard } from "../card/card";
import { EaseMindText } from "../text/text";

export interface CardWidgetProps {
  title: string;
  icon: React.ReactNode;
  value: number | string;
}

export function CardWidget({
  title,
  icon,
  value = "0",
}: CardWidgetProps) {
  return (
    <EaseMindCard variant="outlined">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        width={{ xs: "90vw", md: "30vw", lg: "20vw" }}
        height="100%"
        padding={2}
      >
        <Box display="flex" flexDirection="column">
          <EaseMindText
            variant="sm"
            fontWeight={200}
            color="secondary"
            mb={0.5}
          >
            {title}
          </EaseMindText>
          <EaseMindText variant="lg" fontWeight="bold">
            {value}
          </EaseMindText>
        </Box>

        <Box
          width="40px"
          height="40px"
          borderRadius="50%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          ml="20px"
          mr={{ xs: "10px" }}
        >
          {icon}
        </Box>
      </Box>
    </EaseMindCard>
  );
}
