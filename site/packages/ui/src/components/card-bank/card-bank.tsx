import { Box, CardContent } from "@mui/material";
import { colorsPalette, useTheme } from "@repo/utils";
import { BankCardVariant, BankCardFunction } from "../../classes";
import { EaseMindCard } from "../card/card";
import { EaseMindText } from "../text/text";

import "./style.scss";

export interface EaseMindCardBankProps {
  name: string;
  cardNumber: string;
  expirationDate?: string;
  functions?: BankCardFunction[];
  variant: BankCardVariant;
}

export function EaseMindCardBank({
  name,
  cardNumber,
  variant,
}: EaseMindCardBankProps) {
  const { isDarkMode } = useTheme();

  const palette = !isDarkMode ? colorsPalette.light : colorsPalette.dark;

  const variantColorMap: Record<string, string> = {
    platinum: palette["background.platinumCard"],
    gold: palette["background.goldcard"],
    black: palette["background.blackCard"],
  };

  const bgcolor = variantColorMap[variant] || palette["grey.400"];

  function maskCardNumber(cardNumber: string): string {
    const cardNumberStr = String(cardNumber);
    const lastFourDigits = cardNumberStr.slice(-4);
    const maskedCardNumber = "**** **** ****";

    return `${maskedCardNumber} ${lastFourDigits}`;
  }

  return (
    <Box
      className="card-bank--container"
      sx={{
        width: { xs: "100%", md: "639px" },
      }}
    >
      <EaseMindCard
        bgcolor={bgcolor}
        variant="elevation"
        className="card-bank--container__card"
      >
        <Box padding={2} gap={2}>
          <CardContent>
            <Box display="flex" flexDirection="column">
              <EaseMindText
                variant="md"
                fontWeight={600}
                style={{ fontStyle: "italic" }}
              >
                Ease
              </EaseMindText>
              <EaseMindText variant="xs" fontWeight={400} marginBottom={2}>
                {variant}
              </EaseMindText>

              <Box
                width={{ xs: "80%", sm: "60%", md: "40%" }}
                maxWidth={500}
                marginY={2}
              ></Box>

              <Box display="flex" flexDirection="column" marginTop={1}>
                <EaseMindText variant="sm" fontWeight={100} marginBottom={4}>
                  {name}
                </EaseMindText>
                <EaseMindText variant="sm" fontWeight={200} marginTop={4}>
                  {maskCardNumber(cardNumber)}
                </EaseMindText>
              </Box>
            </Box>
          </CardContent>
        </Box>
      </EaseMindCard>
    </Box>
  );
}
