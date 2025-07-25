import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import { useAppSelector } from "@/hooks/useStore";
import { Header } from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { AccountSidebarWidth } from "@/components/profile2/Constants";
import AccountSidebar from "@/components/profile2/AccountSidebar";
import useBrowser from "./hooks/useBrowser";
import Footer from "./components/Footer";

export function Layout({ children, footer = false }: { children: ReactNode; footer?: boolean }) {
  const router = useRouter();
  const pathname = router.pathname;
  const theme = useTheme();
  const { isMobile } = useBrowser();

  const {
    isPromptsFiltersSticky,
    isDocumentsFiltersSticky,
    isChatHistorySticky,
    isPromptsReviewFiltersSticky,
    isLearnSidebarSticky,
  } = useAppSelector(state => state.sidebar);

  const isPromptsPage = pathname.split("/")[1] === "explore";
  const isDocumentsPage = pathname.split("/")[1] === "sparks";
  const isChatPage = pathname.split("/")[1] === "chat";
  const isPromptPage = pathname.split("/")[1] === "prompt";
  const isPromptsReview = pathname.split("/")[2] === "prompts-review";
  const isAccountPage = pathname.split("/")[1] === "profile" && !isPromptsReview;
  const isLearnPage = ["learn", "terms-of-use", "privacy-policy"].includes(pathname.split("/")[1]);

  const sidebarExpanded =
    (isPromptsPage && isPromptsFiltersSticky) ||
    (isChatPage && isChatHistorySticky) ||
    (isDocumentsPage && isDocumentsFiltersSticky) ||
    (isPromptsReview && isPromptsReviewFiltersSticky) ||
    (isLearnPage && isLearnSidebarSticky);

  const containerWidth = `${theme.custom.leftClosedSidebarWidth} ${sidebarExpanded ? "+ 343px" : ""}`;

  const showFooter = footer || (isMobile && !isChatPage && !isPromptPage);

  return (
    <Stack
      direction={"row"}
      sx={{ bgcolor: "surfaceContainerLow" }}
    >
      <Box width={{ xs: "100%", md: isAccountPage ? `calc(100% -  ${AccountSidebarWidth}px)` : "100%" }}>
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
              marginTop: { xs: -1, md: `calc(${theme.custom.headerHeight.md} + 2px)` },
            }}
          >
            <Grid
              display={"flex"}
              flexDirection={"column"}
              gap={"16px"}
            >
              {children}
              {showFooter && <Footer />}
            </Grid>
          </Box>
        </Box>
      </Box>
      {isAccountPage && !isMobile && <AccountSidebar />}
    </Stack>
  );
}
