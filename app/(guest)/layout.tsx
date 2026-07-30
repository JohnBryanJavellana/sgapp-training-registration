'use client';

import { Box, Container } from "@mui/material";
import './guest.css';

export default function GuestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Box sx={{
            minHeight: '100vh',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
        }}>
            <Container disableGutters maxWidth="sm" sx={{ px: { xs: 2, md: 0 } }}>
                {children}
            </Container>
        </Box>
    );
}