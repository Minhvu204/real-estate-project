import { useState } from 'react';
import { Box, Button, Container, Snackbar, Alert, TextField, Typography, CircularProgress, Paper } from '@mui/material';
import { register } from '../../services/auth';
import type { RegisterPayload } from '../../services/auth';

const initialForm: RegisterPayload & { confirmPassword: string } = {
    fullName: '',
    email: '',
    password: '',
    phone: 0,
    confirmPassword: '',
    role: 'buyer'
};

export default function RegisterPage() {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!form.fullName.trim()) return 'Vui lòng nhập họ tên';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email không hợp lệ';
        if (form.password.length < 6) return 'Mật khẩu phải ít nhất 6 ký tự';
        if (form.password !== form.confirmPassword) return 'Mật khẩu nhập lại không khớp';
        return '';
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const msg = validate();
        if (msg) {
            setSnack({ open: true, message: msg, severity: 'error' });
            return;
        }
        setLoading(true);
        try {
            const { message } = await register({
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                password: form.password,
                phone: form.phone,
                role: form.role
            });
            setSnack({ open: true, message: message || 'Đăng ký thành công', severity: 'success' });
            setForm(initialForm);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Đăng ký thất bại';
            setSnack({ open: true, message, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: '#E2DCC3' }}>
                <Typography variant="h5" gutterBottom>
                    Đăng ký tài khoản
                </Typography>
                <Box component="form" onSubmit={onSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="UserName"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        margin="normal"
                        placeholder='Type your UserName'
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={form.phone || ''}
                        placeholder='type your Phone'
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        placeholder='Type your password'
                        value={form.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                        helperText="Ít nhất 6 ký tự"
                    />
                    <TextField
                        fullWidth
                        label="Comfirm PassWord"
                        name="confirmPassword"
                        type="password"
                        placeholder='Type your confirm password'
                        value={form.confirmPassword}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Box sx={{ mt: 2, position: 'relative' }}>
                        <Button sx={{ backgroundColor: '#97D328' }} type="submit" variant="contained" disabled={loading} fullWidth>
                            {loading ? 'loading Register...' : 'Register'}
                        </Button>
                        {loading && (
                            <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />
                        )}
                    </Box>
                </Box>
            </Paper>
            <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
                <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

