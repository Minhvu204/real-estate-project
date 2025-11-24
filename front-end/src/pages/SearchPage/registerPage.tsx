import React, { useState } from "react";
import {
	Typography, Box, TextField, Button, Checkbox, FormControlLabel,
	Divider, InputAdornment, IconButton, Zoom
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";
import { register } from "../../services/auth";
import type { RegisterPayload } from "../../services/auth";

const RegisterPage: React.FC = () => {
	const navigate = useNavigate();

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [agree, setAgree] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const validateForm = () => {
		if (!fullName.trim()) return "Vui lòng nhập họ tên";
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Email không hợp lệ";
		if (password.length < 6) return "Mật khẩu phải ít nhất 6 ký tự";
		if (password !== confirmPassword) return "Mật khẩu nhập lại không khớp";
		if (!agree) return "You must agree to the terms";
		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccessMessage(null);

		if (!fullName || !email || !phone || !password || !confirmPassword) {
			setError("Please fill in all fields");
			return;
		}

		const validationMessage = validateForm();
		if (validationMessage) {
			setError(validationMessage);
			return;
		}

		const numericPhone = Number(phone.replace(/[^\d]/g, ""));
		if (!numericPhone || Number.isNaN(numericPhone)) {
			setError("Phone number must be numeric");
			return;
		}

		const payload: RegisterPayload = {
			fullName: fullName.trim(),
			email: email.trim(),
			phone: numericPhone,
			password,
		};

		try {
			setLoading(true);
			await register(payload);
			setSuccessMessage("Account created successfully. Redirecting to login...");
			setTimeout(() => navigate("/login"), 1500);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Registration failed";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: { xs: "column", md: "row" },
				background: "#f5f5f5",
			}}
		>
			{/* LEFT SIDE — IMAGE FIXED */}
			<Zoom in timeout={1000}>
				<Box
					sx={{
						flex: { xs: "1", md: "0 0 60%" },
						background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
						borderRadius: { xs: "0px 0px 0 0", md: "0" },
						p: { xs: 4, md: 6 },
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						position: "relative",
						overflow: "hidden",
						boxShadow: { xs: "0 25px 50px rgba(0,0,0,0.3)", md: "none" },
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: "url(https://cdnmedia.baotintuc.vn/Upload/GBzr0rzEkBb6ua36h4mJ9w/files/2022/09/P3.jpg)",
						},
					}}
				>
					<Box
						sx={{
							position: "relative",
							zIndex: 1,
							textAlign: "center",
						}}
					>
						<Box
							sx={{
								width: 100,
								height: 100,
								borderRadius: "24px",
								background: "rgba(255,255,255,0.2)",
								backdropFilter: "blur(10px)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								mb: 3,
								mx: "auto",
								boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
								border: "2px solid rgba(255,255,255,0.3)",
							}}
						>
							<HomeIcon sx={{ fontSize: 50, color: "white" }} />
						</Box>
						<Typography
							variant="h3"
							sx={{
								fontWeight: 900,
								color: "white",
								mb: 2,
								letterSpacing: "-0.02em",
								textShadow: "0 4px 12px rgba(0,0,0,0.2)",
							}}
						>
							Dwello
						</Typography>
						<Typography
							sx={{
								color: "rgba(255,255,255,0.9)",
								fontSize: "1.1rem",
								fontWeight: 400,
								lineHeight: 1.6,
								maxWidth: 500,
								mx: "auto",
							}}
						>
							Your journey to finding the perfect home starts here
						</Typography>
						<Box
							sx={{
								mt: 4,
								display: "flex",
								gap: 2,
								justifyContent: "center",
								flexWrap: "wrap",
							}}
						>
							{["10k+ Homes", "Trusted Platform", "24/7 Support"].map((item, i) => (
								<Box
									key={i}
									sx={{
										px: 2,
										py: 1,
										borderRadius: 3,
										background: "rgba(255,255,255,0.15)",
										backdropFilter: "blur(10px)",
										border: "1px solid rgba(255,255,255,0.2)",
										fontSize: "0.85rem",
										fontWeight: 600,
										color: "white",
									}}
								>
									{item}
								</Box>
							))}
						</Box>
					</Box>
				</Box>
			</Zoom>


			{/* RIGHT SIDE — FORM */}
			<Box
				sx={{
					flex: { xs: 1, md: "0 0 40%" },
					py: 6,
					px: { xs: 4, md: 6 },
					background: "white",
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-start",
				}}
			>
				<Zoom in timeout={1100}>
					<Box>
						<Typography
							variant="h4"
							sx={{
								fontWeight: 800,
								mb: 1,
								background: "linear-gradient(135deg, #667eea, #764ba2)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
							}}
						>
							Create Account
						</Typography>

						<Typography sx={{ mb: 4, color: "rgba(0,0,0,0.6)" }}>
							Join us and find your perfect home
						</Typography>

						{/* FORM */}
						<Box component="form" onSubmit={handleSubmit}>
							<TextField
								placeholder="Full name"
								fullWidth
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								sx={{ mb: 2.5 }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<HomeIcon sx={{ color: "#667eea" }} />
										</InputAdornment>
									),
								}}
							/>

							<TextField
								placeholder="Email"
								fullWidth
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								sx={{ mb: 2.5 }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<EmailOutlinedIcon sx={{ color: "#667eea" }} />
										</InputAdornment>
									),
								}}
							/>

							<TextField
								placeholder="Phone"
								fullWidth
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								sx={{ mb: 2.5 }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<PhoneIphoneIcon sx={{ color: "#667eea" }} />
										</InputAdornment>
									),
								}}
							/>

							<TextField
								placeholder="Password"
								type={showPassword ? "text" : "password"}
								fullWidth
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								sx={{ mb: 2.5 }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LockOutlinedIcon sx={{ color: "#667eea" }} />
										</InputAdornment>
									),
									endAdornment: (
										<InputAdornment position="end">
											<IconButton onClick={() => setShowPassword(!showPassword)}>
												{showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>

							<TextField
								placeholder="Confirm password"
								type="password"
								fullWidth
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								sx={{ mb: 2.5 }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LockOutlinedIcon sx={{ color: "#667eea" }} />
										</InputAdornment>
									),
								}}
							/>

							<FormControlLabel
								control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />}
								label="I agree to the Terms & Privacy Policy"
								sx={{ mb: 2 }}
							/>

							{error && (
								<Box
									sx={{
										mb: 2,
										p: 2,
										borderRadius: 2,
										background: "linear-gradient(135deg,#ff6b6b,#ee5a6f)",
										color: "white",
									}}
								>
									{error}
								</Box>
							)}

							{successMessage && (
								<Box
									sx={{
										mb: 2,
										p: 2,
										borderRadius: 2,
										background: "linear-gradient(135deg,#56ab2f,#a8e063)",
										color: "white",
									}}
								>
									{successMessage}
								</Box>
							)}

							<Button
								type="submit"
								fullWidth
								disabled={loading}
								sx={{
									py: 2,
									borderRadius: 3,
									fontWeight: 700,
									background: "linear-gradient(135deg,#667eea,#764ba2)",
									color: "white",
									mb: 3,
								}}
							>
								{loading ? "Creating account..." : "Sign Up"}
							</Button>

							<Divider sx={{ my: 3 }}>OR</Divider>

							<GoogleLoginButton />

							<Box sx={{ textAlign: "center", mt: 3 }}>
								<Typography component="span">Already have an account? </Typography>
								<Button
									onClick={() => navigate("/login")}
									sx={{
										textTransform: "none",
										fontWeight: 700,
										background: "linear-gradient(135deg,#667eea,#764ba2)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
									}}
								>
									Login
								</Button>
							</Box>
						</Box>
					</Box>
				</Zoom>
			</Box>
		</Box>
	);
};

export default RegisterPage;
