import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, InitColorSchemeScript } from "@mui/material";
import theme from "./theme";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Mikrotik Training Registration",
    description: "Mikrotik Training Registration",
    icons: {
        icon: '/assets/mikrotik.ico'
    },
};

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-mui-color-scheme="light" suppressHydrationWarning>
            <head>
                <InitColorSchemeScript defaultMode="light" modeStorageKey="mui-mode" />
            </head>
            <body className={`${inter.className}`} suppressHydrationWarning>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme} defaultMode="light" modeStorageKey="mui-mode">
                        <CssBaseline />
                        {children}
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
