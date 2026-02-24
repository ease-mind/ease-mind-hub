import "./header.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Avatar,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
    loggedPages,
    unloggedPages,
    EaseMindButton,
    EaseMindToggleButton,
    SnackbarData,
    AccessModalType,
    EaseMindSnackbar,
} from "@repo/ui";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";
import LoginIcon from "@mui/icons-material/Login";
import { useUser } from "@repo/data-access";
import { EaseMindRegisterModal, EaseMindLoginModal } from "../../modals";
import { useTheme } from "@repo/utils";

export function EaseMindHeader() {
    const { colors, isDarkMode } = useTheme();
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [snackbarData, setSnackbarData] = useState<SnackbarData | null>(null);
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const { user, logout } = useUser();
    const isLogged = !!user;
    const pages = isLogged ? loggedPages : [];

    const settings = [
        {
            name: "Minha conta",
            action: () => navigate('/minha-conta'),
        },
        { name: "Sair", action: () => handleLogout() },
    ];

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);
    const navigate = useNavigate();


    const closeLoginModal = () => setOpenLoginModal(false);
    const closeRegisterModal = () => setOpenRegisterModal(false);

    const closeSnackbar = () => { setSnackbarOpen(false); setSnackbarData(null); };

    const handleLoginModal = ({ status, message }: SnackbarData) => {
        if (status === 'success') {
            setTimeout(() => {
                closeLoginModal();
                navigate('/termometro');
            }, 500);
        } else {
            closeRegisterModal();
            setSnackbarData({ status, message });
            setSnackbarOpen(true);
        }
    };

    const handleRegisterModal = ({ status, message }: SnackbarData) => {
        if (status === 'success') {
            closeRegisterModal();
        }

        closeLoginModal();
        setSnackbarData({ status, message });
        setSnackbarOpen(true);
    };

    const handleModalStates = (type: AccessModalType) => {
        if (type === AccessModalType.REGISTER) {
            closeRegisterModal();
            setOpenLoginModal(true);
        } else {
            closeLoginModal();
            setOpenRegisterModal(true);
        }
    }

    const handleLogout = async (): Promise<void> => {
        handleCloseUserMenu();
        await logout();
        navigate('/');
    };

    return (
        <>
            <AppBar
                id="easemind-header"
                position={"sticky"}
                sx={{
                    width: "100%",
                    transition: "all 0.3s ease",
                    boxShadow: "none",
                    borderBottom: "1px solid rgb(199 201 145 / 20%)",
                    backdropFilter: "blur(8px)",
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Box
                            className={'link'}
                            onClick={() => navigate((isLogged ? '/termometro' : '/'))}
                            sx={{
                                display: { xs: "none", md: "flex" },
                                filter: `${colors['logo.filter']}`
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    fontFamily: "'Bukhari Script', cursive",
                                    fontWeight: 400,
                                    color: colors["coral.800"],
                                    cursor: "pointer",
                                    userSelect: "none"
                                }}
                            >
                                easemind
                            </Typography>
                        </Box>

                        {(pages.length !== 0) ?
                        <Box sx={{ flexGrow: 1, display: isLogged ? { xs: "flex", md: "none" } : "none" }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: "block", md: "none" } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem
                                        key={page.name}
                                        onClick={() => {
                                            handleCloseNavMenu();
                                            (page.blank) ? window.open(page.route, '_blank') : navigate(page.route);
                                        }}
                                    >
                                        <Typography
                                            sx={{ textAlign: "center" }}
                                        >
                                            {page.name}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        : null}
                        <Box
                            className={'link'}
                            onClick={() => navigate((isLogged ? '/termometro' : '/'))}
                            sx={{
                                mr: 2,
                                ml: 2,
                                display: { xs: "flex", md: "none" },
                                width: "80%",
                                justifyContent: isLogged ? "center" : "flex-start",
                                filter: `${colors['logo.filter']}`
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontFamily: "'Bukhari Script', cursive",
                                    fontWeight: 400,
                                    color: colors["coral.contrast"],
                                    cursor: "pointer",
                                    userSelect: "none"
                                }}
                            >
                                easemind
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                flexGrow: 1,
                                justifyContent: "center",
                                display: { xs: "none", md: "flex" },
                            }}
                        >
                            {pages.map((page) => (
                                <EaseMindButton
                                    key={page.name}
                                    label={page.name}
                                    onClick={() => (page.blank) ? window.open(page.route, '_blank') : navigate(page.route)}
                                    sx={{ my: 2, display: "block" }}
                                    variant="text"
                                    color={"primary"}
                                />
                            ))}
                        </Box>

                        <Box display={'flex'} flex={'none'} gap={1}>
                            {!isLogged ? (<>
                                <Box sx={{ display: { xs: "none", md: "flex" } }} gap={1}>
                                    <EaseMindButton
                                        onClick={() => setOpenRegisterModal(true)}
                                        label="Crie uma conta"
                                        color="primary"
                                        variant="contained"
                                    />
                                    <EaseMindButton
                                        onClick={() => setOpenLoginModal(true)}
                                        label="Entre"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>
                                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                                    <Box display={'flex'}>
                                        <IconButton aria-label="Criar uma conta" size="large" color="inherit" onClick={() => setOpenRegisterModal(true)}>
                                            <AppRegistrationRoundedIcon></AppRegistrationRoundedIcon>
                                        </IconButton>
                                        <IconButton aria-label="Entrar em sua conta" size="large" color="inherit" onClick={() => setOpenLoginModal(true)}>
                                            <LoginIcon></LoginIcon>
                                        </IconButton>
                                    </Box>

                                </Box>
                            </>
                            ) : (
                                <>
                                    <Tooltip title="Gerenciar conta">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            {
                                                user?.image ?
                                                    <Avatar alt={user?.name} src={user?.image} /> :
                                                    <Avatar sx={{ bgcolor: colors["coral.400"] }} alt={user?.name} />
                                            }
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: "45px" }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {settings.map((setting) => (
                                            <MenuItem key={setting.name} onClick={setting.action}>
                                                <Typography sx={{ textAlign: "center" }}>
                                                    {setting.name}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </>
                            )
                            }
                            <EaseMindToggleButton />
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <EaseMindRegisterModal open={openRegisterModal} onClose={closeRegisterModal} onSubmit={handleRegisterModal} openModal={handleModalStates} />
            <EaseMindLoginModal open={openLoginModal} onClose={closeLoginModal} onSubmit={handleLoginModal} openModal={handleModalStates} />
            <EaseMindSnackbar open={isSnackbarOpen} data={snackbarData} onClose={closeSnackbar} />
        </>
    );
}
