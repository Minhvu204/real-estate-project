import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: { main: "#374151" },
        secondary: { main: "#7C3AED" },
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
    },
    components: {
        MuiButton: {
            defaultProps: { disableElevation: true },
        },
    },
});

export default theme;
