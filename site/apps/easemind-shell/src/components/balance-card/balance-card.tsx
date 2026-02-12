import { VisibilityRounded, VisibilityOff } from "@mui/icons-material";
import { Box, Typography, Skeleton, IconButton } from "@mui/material";
import { useFinancialData, useUser } from "@repo/data-access";
import { EaseMindCard } from "@repo/ui";
import { useTheme } from "@repo/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export const EaseMindBalanceCard = () => {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();
  const { user } = useUser();
  const { total_value } = useFinancialData();
  const today = new Date();
  const formattedDate = format(today, "EEEE',' dd/MM/yyyy", { locale: ptBR });

  const totalBalance = total_value;
  const isLoading = false;
  const totalBalanceFormatted = totalBalance.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const backgroundStyle = {
    border: "none",
    backgroundImage: `
        url('/images/pixels.svg'),
        ${colors["background.gradient"]}
        
      `,
    backgroundPosition: "right top, left bottom",
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundSize: "contain",
  };

  return (
    <Box
      display={"block"}
      width={{ xs: "100%", md: "100%" }}
      minHeight={"15em"}
    >
      <EaseMindCard styles={backgroundStyle}>
        <Box display={"flex"} flexDirection={"column"} p={{xs: 2, sm: 2, md:4}}>
          <Typography color={"textPrimary"} fontWeight={"bold"} variant="lg">
            {`Bem-vindo(a), ${user?.name?.split(" ")[0] ?? "usuário"}!`}
          </Typography>
          <Typography color={"textPrimary"} variant="xs">
            {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
          </Typography>
        </Box>

        <Box display={"flex"} flexDirection={"column"} p={{xs: 2, sm: 2, md:4}}>
          <Box display={"flex"} alignContent={"center"} gap={1}>
            <Typography
              color={"textPrimary"}
              sx={{ fontWeight: 600 }}
              variant="md"
            >
              Saldo
            </Typography>
            <Box
              tabIndex={0}
              aria-label={visible ? "Ocultar saldo" : "Mostrar saldo"}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setVisible((v) => !v);
                }
              }}
              role="button"
              onClick={() => setVisible(!visible)}
              px="4px"
              sx={{
                cursor: "pointer",
                outline: "none",
                '&:focus': {
                  background: colors["background.accent"],
                  borderRadius: '4px',
                }
              }}
              display={"flex"}
              alignItems={"center"}
            >
              {visible ? <VisibilityRounded /> : <VisibilityOff />}
            </Box>
          </Box>
          <Box display={"flex"} flexDirection={"column"}>
            {isLoading ? (
              <Skeleton width={200} height={50} animation="wave" />
            ) : (
              <Typography
                color={"textPrimary"}
                sx={{ fontWeight: 600 }}
                variant="xxl"
              >
                {visible ? (
                  `${totalBalanceFormatted}`
                ) : (
                  <Skeleton width={200} height={50} animation={false} />
                )}
              </Typography>
            )}

            <Typography color={"textTertiary"} fontSize={"xs"}>
              Conta Corrente
            </Typography>
          </Box>
        </Box>
      </EaseMindCard>
    </Box>
  );
};
