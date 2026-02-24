import { Box, Link } from "@mui/material";
import { useUser } from "@repo/data-access";
import {
  AccessModalType,
  EaseMindAccessModalProps,
  EaseMindButton,
  EaseMindInputController,
  EaseMindModal,
  EaseMindText,
} from "@repo/ui";
import { ReactElement, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

export function EaseMindLoginModal({
  open,
  onClose,
  onSubmit,
  openModal,
}: EaseMindAccessModalProps): ReactElement {
  const [isLoading, setLoading] = useState(false);
  const { login } = useUser();

  const loginMethods = useForm<{ email: string; password: string }>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoading(true);

    const result = await login(data);

    if (result.success) {
      loginMethods.reset();
      onSubmit({ status: "success" });
    } else {
      onSubmit({ 
        status: "error", 
        message: result.message || "Ocorreu um erro ao tentar logar no sistema, tente novamente mais tarde por favor." 
      });
    }
    
    setLoading(false);
  };

  return (
    <>
      <EaseMindModal
        title={"Login"}
        open={open}
        illustrationShow
        onClose={() => { loginMethods.reset(); onClose(); }}
      >
        <>
          <FormProvider {...loginMethods}>
            <form onSubmit={loginMethods.handleSubmit(handleLogin)}>
              <EaseMindInputController
                control={loginMethods.control}
                rules={{ required: true }}
                name="email"
                autoComplete="email"
                type="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
              />
              <EaseMindInputController
                control={loginMethods.control}
                rules={{ required: true }}
                name="password"
                autoComplete="current-password"
                type="password"
                label="Senha"
                placeholder="Digite sua senha"
              />

              <Box
                mt={1}
                display={"flex"}
                gap={4}
                flexDirection={"column"}
                justifyContent={"center"}
              >
                <Link component="button" variant="sm" color={"secondary"}>
                  Esqueceu sua senha?
                </Link>
                <EaseMindButton
                  label={"Entrar"}
                  color={"secondary"}
                  variant={"contained"}
                  loading={isLoading}
                  fullWidth
                ></EaseMindButton>
              </Box>
            </form>
          </FormProvider>
          <Box
            pt={4}
            display={"flex"}
            gap={1}
            justifyContent={"center"}
            flexWrap={"wrap"}
          >
            <EaseMindText>Não tem uma conta?</EaseMindText>
            <Link
              component="button"
              variant="sm"
              color={"secondary"}
              onClick={() => openModal(AccessModalType.LOGIN)}
            >
              Crie uma agora!
            </Link>
          </Box>
        </>
      </EaseMindModal>
    </>
  );
}
