import { Box, Card } from "@mui/material"
import Image from "next/image";

interface GuestCardHeaderProps {
    children: React.ReactNode
}

export default function GuestCardHeader({ children }: GuestCardHeaderProps) {
    return <Box sx={{ userSelect: 'none', my: 3 }}>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Image src={'/assets/guest-logo-2.png'} height={70} width={250} alt="" loading="eager" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </Box>

        <Box>
            <Card>
                {children}
            </Card>
        </Box>
    </Box>
}