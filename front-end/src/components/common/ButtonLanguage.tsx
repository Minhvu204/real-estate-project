import { Button, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

const ButtonLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: "en" | "vi") => {
    i18n.changeLanguage(lng);
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant={i18n.language === "en" ? "contained" : "outlined"}
        onClick={() => changeLanguage("en")}
      >
        English
      </Button>
      <Button
        variant={i18n.language === "vi" ? "contained" : "outlined"}
        onClick={() => changeLanguage("vi")}
      >
        Vietnamese
      </Button>
    </Stack>
  );
};

export default ButtonLanguage;
