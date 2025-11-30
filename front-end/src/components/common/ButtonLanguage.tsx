import { useState } from "react";
import { Button, Menu, MenuItem, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ButtonLanguage = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng: "en" | "vi") => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  const currentLanguage = i18n.language === "en" ? "English" : "Tiếng Việt";
  const currentFlag = i18n.language === "en" ? "🇺🇸" : "🇻🇳";

  return (
    <>
      <Button
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon sx={{ color: "rgba(0,0,0,0.7)" }} />}
        variant="outlined"
        sx={{
          color: "rgba(0,0,0,0.7)",
          fontWeight: 600,
          textTransform: "none",
          px: 2.5,
          py: 1,
          borderRadius: 3,
          fontSize: "0.95rem",
          borderColor: "rgba(0,0,0,0.5)",
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
            borderColor: "rgba(0,0,0,0.7)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span style={{ fontSize: "1.2rem" }}>{currentFlag}</span>
          {currentLanguage}
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
            mt: 1,
            minWidth: 180,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
        }}
      >
        <MenuItem
          onClick={() => changeLanguage("vi")}
          selected={i18n.language === "vi"}
          sx={{
            py: 1.5,
            px: 2,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
            },
            "&.Mui-selected": {
              backgroundColor: "rgba(0,0,0,0.04)",
              "& .MuiTypography-root": {
                fontWeight: 600,
              },
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.08)",
              },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, fontSize: "0.95rem", color: "rgba(0,0,0,0.7)", fontWeight: i18n.language === "vi" ? 600 : 400 }}>
            <span style={{ fontSize: "1.2rem" }}>🇻🇳</span>
            Tiếng Việt
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => changeLanguage("en")}
          selected={i18n.language === "en"}
          sx={{
            py: 1.5,
            px: 2,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
            },
            "&.Mui-selected": {
              backgroundColor: "rgba(0,0,0,0.04)",
              "& .MuiTypography-root": {
                fontWeight: 600,
              },
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.08)",
              },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, fontSize: "0.95rem", color: "rgba(0,0,0,0.7)", fontWeight: i18n.language === "en" ? 600 : 400 }}>
            <span style={{ fontSize: "1.2rem" }}>🇺🇸</span>
            English
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ButtonLanguage;
