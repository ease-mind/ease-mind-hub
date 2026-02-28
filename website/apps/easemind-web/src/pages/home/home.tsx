import { ReactElement, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { EaseMindCard } from "@repo/ui";
import {
  PsychologyOutlined,
  AccessibilityNewOutlined,
  AutoAwesomeOutlined,
  HealthAndSafetyOutlined,
} from "@mui/icons-material";
import { useTheme } from "@repo/utils";

type Benefit = {
  icon: ReactElement;
  title: string;
  description: string;
};

const BENEFITS: Benefit[] = [
  {
    icon: <PsychologyOutlined sx={{ fontSize: 80 }} />,
    title: "Flexibilidade Cognitiva",
    description:
      "Adapte suas tarefas ao seu ritmo mental. Nosso sistema reconhece padrões e sugere organizações personalizadas para sua mente.",
  },
  {
    icon: <AccessibilityNewOutlined sx={{ fontSize: 80 }} />,
    title: "Acessibilidade Inclusiva",
    description:
      "Recursos adaptados para diferentes necessidades cognitivas, incluindo TDAH, autismo e outras neurodivergências.",
  },
  {
    icon: <AutoAwesomeOutlined sx={{ fontSize: 80 }} />,
    title: "Recomendações Inteligentes",
    description:
      "Inteligência artificial que aprende com você e sugere momentos ideais para cada tipo de tarefa baseado no seu perfil cognitivo.",
  },
  {
    icon: <HealthAndSafetyOutlined sx={{ fontSize: 80 }} />,
    title: "Bem-estar Mental",
    description:
      "Monitore sua carga cognitiva e receba alertas para pausas estratégicas, mantendo sua saúde mental em equilíbrio.",
  },
];

const EaseMindHomePage = () => {
  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
    const header = document.getElementById("easemind-header");

    if (!header) return;

    const headerOriginal = header.style.cssText;

    const setHeaderStyle = () => {
      if (!isDarkMode) {
        if (window.scrollY > 50) {
          header.style.background = "rgb(255 255 255 / 85%)";
        } else {
          header.style.background = "transparent";
        }
      } else {
        if (window.scrollY > 50) {
          header.style.background = "rgb(16 18 9 / 70%)";
        } else {
          header.style.background = "transparent";
        }
      }
    };

    setHeaderStyle();
    window.addEventListener("scroll", setHeaderStyle);
    return () => {
      header.style.cssText = headerOriginal;
      window.removeEventListener("scroll", setHeaderStyle);
    };
  }, [isDarkMode]);

  useEffect(() => {
    const footer = document.getElementById("easemind-bg-footer");
    const footerText = document.getElementById('easemind-footer-text');
    if (!footer || !footerText) return;

    const bodyOriginal = document.body.style.cssText;
    const footerOriginal = footer.style.cssText;
    const footerTextOriginal = footerText.style.cssText;

    if (!isDarkMode) {
      footer.style.backgroundColor = colors["coral.dark"];
      footerText.style.color = colors["coral.100"];
      document.body.style.background =
        "radial-gradient(100% 244.46% at 0% 0%, rgb(255 177 184 / 75%) 0%, rgb(255, 210, 148) 100%) 0% 0% / 135% 130%, radial-gradient(50% 122.23%, rgb(230, 57, 70) 0%, rgb(255, 140, 126) 100%), radial-gradient(100.45% 245.58% at 0% 0%, rgb(255, 138, 126) 0%, rgb(255, 181, 173) 100%), linear-gradient(127.43deg, rgb(204, 47, 60) 0%, rgb(255, 107, 119) 100%)";
      document.body.style.backgroundBlendMode =
        "lighten, color-burn, color-dodge, difference, normal";
      document.body.style.backgroundSize = "135% 130%";
    } else {
      document.body.style.background =
        "radial-gradient(100% 244.46% at 0% 0%, rgb(77 15 24) 0%, rgb(128 25 41) 100%) 0% 0% / 115% 115%, radial-gradient(50% 122.23% at 50% 50%, rgb(102 20 32) 0%, rgb(153 31 45) 100%), radial-gradient(100.45% 245.58% at 0% 0%, rgb(128 25 41) 0%, rgb(230 57 70) 100%, rgb(255 67 83) 100%), linear-gradient(127.43deg, rgb(255 67 83) 0%, rgb(204 47 60) 100%)";
      document.body.style.backgroundBlendMode =
        "darken, color-dodge, difference, normal";
      document.body.style.backgroundSize = "135% 125%";
    }
    document.body.style.animation = "gradientShift 15s ease-in-out infinite";
    return () => {
      document.body.style.cssText = bodyOriginal;
      footer.style.cssText = footerOriginal;
      footerText.style.cssText = footerTextOriginal;
    };
  }, [isDarkMode]);

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"flex-end"}
        justifyContent={"center"}
        flexDirection={"column"}
      >
        <Box
          width={"100%"}
          minHeight={"25em"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          textAlign={"center"}
          gap={2}
          pb={5}
        >
          <Box p={2} gap={3}>
            <Typography fontSize={"40pt"} fontWeight={"bolder"}>
              Gerencie suas tarefas <br />
              respeitando seu ritmo cognitivo.
            </Typography>
            <Typography variant="md">
              Descubra o EaseMind e transforme sua produtividade com flexibilidade e cuidado mental.
            </Typography>
          </Box>
        </Box>

        <Box
          minWidth={"100vw"}
          bgcolor={colors["coral.50"]}
          py={5}
          minHeight={"35em"}
          width={"100%"}
          display={"flex"}
          flexDirection={"column"}
          textAlign={"center"}
          gap={4}
        >
          <Typography
            fontSize={"35pt"}
            fontWeight={"bolder"}
            color={colors["coral.900"]}
          >
            Conheça os benefícios do EaseMind
          </Typography>
          <Box>
            <Box
              display={"flex"}
              flexDirection={"row"}
              gap={2}
              justifyContent={"center"}
              flexWrap={"wrap"}
            >
              {BENEFITS.map(
                ({ icon, title, description }: Benefit, index: number) => (
                  <Box maxWidth={"20em"} key={index}>
                    <EaseMindCard
                      bgcolor={colors["coral.contrast"]}
                      variant={"outlined"}
                      styles={{ borderColor: colors["coral.100"] }}
                    >
                      <Box
                        minHeight={"21em"}
                        px={4}
                        p={4}
                        gap={2}
                        color={colors["coral.100"]}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        {icon}
                        <Typography
                          variant="md"
                          fontWeight={"bold"}
                          color={colors["coral.400"]}
                          style={{ marginTop: "8px" }}
                        >
                          {title}
                        </Typography>
                        <Typography variant="sm" color={colors["coral.100"]}>
                          {description}
                        </Typography>
                      </Box>
                    </EaseMindCard>
                  </Box>
                )
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EaseMindHomePage;
