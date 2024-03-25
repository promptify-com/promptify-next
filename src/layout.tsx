import { ReactNode } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { Header } from "@/components/Header";
import { theme } from "@/theme";
import Sidebar from "./components/sidebar/Sidebar";
import { useAppSelector } from "@/hooks/useStore";
import { useRouter } from "next/router";
import { AccountSidebarWidth } from "@/components/profile2/Constants";
import AccountSidebar from "./components/profile2/AccountSidebar";

export const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const isPromptsFiltersSticky = useAppSelector(state => state.sidebar.isPromptsFiltersSticky);
  const isDocumentsFiltersSticky = useAppSelector(state => state.sidebar.isDocumentsFiltersSticky);
  const isChatHistorySticky = useAppSelector(state => state.sidebar.isChatHistorySticky);
  const isPromptsPage = pathname.split("/")[1] === "explore";
  const isDocumentsPage = pathname.split("/")[1] === "sparks";
  const isChatPage = pathname.split("/")[1] === "chat";
  const isAccountPage = pathname.split("/")[1] === "profile";

  const sidebarExpanded =
    (isPromptsPage && isPromptsFiltersSticky) ||
    (isChatPage && isChatHistorySticky) ||
    (isDocumentsPage && isDocumentsFiltersSticky);

  const containerWidth = `${theme.custom.leftClosedSidebarWidth} ${sidebarExpanded ? "+ 343px" : ""}`;

  return (
    <>
      <Stack
        direction={"row"}
        sx={{ bgcolor: "surfaceContainerLow" }}
      >
        <Box width={{ md: isAccountPage ? `calc(100% -  ${AccountSidebarWidth}px)` : "100%" }}>
          <Sidebar />
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={"2px"}
            sx={{
              minHeight: "100svh",
              maxWidth: {
                xs: "100%",
                md: `calc(100% - (${containerWidth}))`,
              },
              ml: { md: "auto" },
            }}
          >
            <Header transparent />
            <Box
              bgcolor={"surfaceContainerLowest"}
              minHeight={{
                xs: `calc(100svh - ${theme.custom.headerHeight.xs})`,
                md: `calc(100svh - ${theme.custom.headerHeight.md})`,
              }}
              sx={{
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                overflow: "hidden",
                zIndex: 1,
                marginTop: { xs: "0", md: `calc(${theme.custom.headerHeight.md} + 2px)` },
              }}
            >
              <Grid
                display={"flex"}
                flexDirection={"column"}
                gap={"16px"}
              >
                {children}
              </Grid>
            </Box>
          </Box>
        </Box>
        {isAccountPage && <AccountSidebar />}
      </Stack>
    </>
  );
};
