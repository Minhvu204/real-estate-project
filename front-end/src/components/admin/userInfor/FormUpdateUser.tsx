import type { User } from "@/types/User";
import {
  Avatar,
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

interface FormUpdateUserProps {
  user?: User;
  errors: Record<string, string>;
  Role: string[];
  handleUpdate: () => void;
  handleBack: () => void;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const FormUpdateUser: React.FC<FormUpdateUserProps> = ({
  user,
  errors,
  Role,
  handleUpdate,
  handleBack,
  handleChange,
}) => {
  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleBack}
        sx={{ mt: 3, ml: 3, textTransform: "none", fontWeight: "bold" }}
      >
        ← Quay lại
      </Button>

      <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          color="primary"
        >
          Update User
        </Typography>

        {user && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: "#fafafa",
            }}
          >
            <Avatar
              alt={user.fullName}
              src={user.avatar}
              sx={{
                width: 250,
                height: 250,
                mb: 2,
                border: "2px solid #1976d2",
              }}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                width: "100%",
              }}
            >
              <TextField
                label="Full Name"
                variant="outlined"
                value={user.fullName}
                name="fullName"
                error={!!errors.fullName}
                helperText={errors.fullName}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                variant="outlined"
                value={user.email}
                name="email"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Phone"
                variant="outlined"
                value={user.phone}
                name="phone"
                error={!!errors.phone}
                helperText={errors.phone}
                onChange={handleChange}
              />
              {/* <TextField
                label="Password"
                variant="outlined"
                value={user.password}
                name="password"
                error={!!errors.password}
                helperText={errors.password}
                onChange={handleChange}
              /> */}
              <TextField
                label="Role"
                select
                variant="outlined"
                name="role"
                value={user.role}
                onChange={handleChange}
              >
                {Role.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              sx={{
                alignSelf: "flex-center",
                mt: 2,
                px: 4,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Update
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
};

export default FormUpdateUser;
