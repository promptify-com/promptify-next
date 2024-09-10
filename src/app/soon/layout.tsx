import { ReactNode } from "react";
// Mui
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
// Components
import MainLayout from "@components/layouts/main_layout";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <MainLayout>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        {children}
      </Box>
    </MainLayout>
  );
}
