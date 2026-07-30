'use client';

import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';
import { createContext, useContext, useState, ReactNode } from 'react';

type LayoutContextType = {
    showLoading: boolean;
    setShowLoadingIndicator: (e: boolean) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
    const [showLoading, setShowLoading] = useState(false);

    const setShowLoadingIndicator = (e: boolean) => setShowLoading(e);

    return (
        <LayoutContext.Provider value={{ showLoading, setShowLoadingIndicator }}>
            <Backdrop sx={{
                userSelect: 'none',
                color: '#000',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'transparent',
                alignItems: 'flex-start',
                paddingTop: '12px'
            }} open={showLoading}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#fef7e0',
                    border: '1px solid #f1e4bc',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    padding: '6px 16px',
                    borderRadius: '4px',
                }}>
                    <CircularProgress size={16} color="inherit" sx={{ color: '#b06000' }} />
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>
                        Loading...
                    </Typography>
                </Box>
            </Backdrop>

            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (!context) return {
        showLoading: false,
        setShowLoadingIndicator: () => { }
    };
    return context;
}