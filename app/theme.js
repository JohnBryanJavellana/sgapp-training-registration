"use client";

import { extendTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

const theme = extendTheme({
    cssVarPrefix: "mui",
    colorSchemeSelector: "class",
    typography: {
        fontFamily: inter.style.fontFamily,
    },
    colorSchemes: {
        light: {
            palette: {
                background: {
                    default: '#F4F7FC',
                    paper: '#ffffff',
                },
            },
        },
        dark: {
            palette: {
                background: {
                    default: '#0c1425',
                    paper: '#141b2d'
                },
            },
        },
    }
});

export default theme;
