import { Box, Typography } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
    return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "surface.2",
            fontSize: "16px"
          }}
        >
          <Typography variant="h2" sx={{ textAlign: "center", fontSize: "inherit" }}>
            Ooops!! page could not be found. <br />
            <Link href="/" style={{ textDecoration: "none" }}>
                Go back Home
            </Link>
          </Typography>
        </Box>
    );
}