import { Box, AppBar, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AccountContext } from "../../providers/AccountProvider";

const Navbar = () => {
    const { account, setAccount } = useContext(AccountContext);

    const logoutHandler = () => {
        localStorage.removeItem("token");
        setAccount(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Box display="flex">
                    <Box
                        display="flex"
                        justifyContent="center"
                        sx={{ flexGrow: 1 }}
                    >
                        <Link to="/" style={{ color: "black" }}>
                            <Button
                                sx={{
                                    fontSize: "1.3em",
                                    fontWeight: "bold",
                                    marginLeft: "1em",
                                }}
                                color="inherit"
                            >
                                Головна
                            </Button>
                        </Link>
                        <Link to="/create" style={{ color: "black" }}>
                            <Button
                                sx={{
                                    fontSize: "1.3em",
                                    fontWeight: "bold",
                                    marginLeft: "1em",
                                }}
                                color="inherit"
                            >
                                Створити нотатку
                            </Button>
                        </Link>
                        <Link to="/notes" style={{ color: "black" }}>
                            <Button
                                sx={{
                                    fontSize: "1.3em",
                                    fontWeight: "bold",
                                    marginLeft: "1em",
                                }}
                                color="inherit"
                            >
                                Переглянути нотатки
                            </Button>
                        </Link>
                    </Box>
                    {account && (
                        <Box sx={{ mr: 2 }}>
                            <Button
                                onClick={logoutHandler}
                                sx={{
                                    fontSize: "1.3em",
                                    fontWeight: "bold",
                                    marginLeft: "1em",
                                }}
                                color="inherit"
                            >
                                Вийти
                            </Button>
                        </Box>
                    )}
                </Box>
            </AppBar>
        </Box>
    );
};

export default Navbar;
