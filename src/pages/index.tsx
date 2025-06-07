import React from "react";
import { Box, Typography, Container, Paper, LinearProgress } from "@mui/material";
import { Construction, Schedule, Email } from "@mui/icons-material";
import Head from "next/head";

const MaintenancePage = () => {
  return (
    <>
      <Head>
        <title>Promptify - Under Maintenance</title>
        <meta
          name="description"
          content="Promptify is currently under maintenance. We'll be back soon!"
        />
        <meta
          name="robots"
          content="noindex, nofollow"
        />
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={10}
            sx={{
              padding: { xs: 4, md: 6 },
              borderRadius: 4,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Icon */}
            <Box sx={{ mb: 3 }}>
              <Construction
                sx={{
                  fontSize: { xs: 60, md: 80 },
                  color: "#667eea",
                  mb: 2,
                }}
              />
            </Box>

            {/* Main Title */}
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 600,
                color: "#2c3e50",
                mb: 2,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Under Maintenance
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                color: "#7f8c8d",
                mb: 4,
                fontWeight: 300,
              }}
            >
              We're making some improvements to serve you better
            </Typography>

            {/* Progress Bar */}
            <Box sx={{ mb: 4 }}>
              <LinearProgress
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#ecf0f1",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#667eea",
                    borderRadius: 4,
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "#95a5a6" }}
              >
                Updating systems...
              </Typography>
            </Box>

            {/* Message */}
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.1rem",
                color: "#34495e",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Our team is working hard to bring you new features and improvements. We'll be back online shortly. Thank
              you for your patience!
            </Typography>

            {/* Time Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 4,
                flexWrap: "wrap",
              }}
            >
              <Schedule sx={{ color: "#3498db" }} />
              <Typography
                variant="body2"
                sx={{ color: "#7f8c8d" }}
              >
                Expected downtime: 2-4 hours
              </Typography>
            </Box>

            {/* Contact Info */}
            <Box
              sx={{
                backgroundColor: "#f8f9fa",
                padding: 3,
                borderRadius: 2,
                border: "1px solid #e9ecef",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Email sx={{ color: "#e74c3c", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#2c3e50", fontWeight: 500 }}
                >
                  Need immediate assistance?
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "#7f8c8d" }}
              >
                Contact us at{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#3498db",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  c@promptify.com
                </Box>
              </Typography>
            </Box>

            {/* Footer */}
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 4,
                color: "#95a5a6",
              }}
            >
              © 2025 Promptify. We'll be back soon!
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default MaintenancePage;
