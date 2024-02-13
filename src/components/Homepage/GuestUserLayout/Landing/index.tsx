import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Google } from "@/assets/icons/google";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { isDesktopViewPort } from "@/common/helpers";
import { useState } from "react";
import SocialMediaAuth from "@/components/login/SocialMediaAuth";
import { BLOG_URL } from "@/common/constants";
import Link from "next/link";
import LandingImage from "./LandingImage";

function Landing() {
  const [socialAnchor, setSocialAnchor] = useState<null | HTMLElement>(null);

  const socialOpened = Boolean(socialAnchor);

  const handleOpenSocial = (e: React.MouseEvent<HTMLElement>) => setSocialAnchor(e.currentTarget);
  const handleCloseSocial = () => setSocialAnchor(null);

  return (
    <Stack
      direction={{ md: "row" }}
      justifyContent={"center"}
      alignItems={"center"}
      gap={{ xs: 6, md: 8 }}
      sx={{
        minHeight: "60svh",
        maxWidth: "90%",
        m: "auto",
        p: { md: "48px 24px" },
        mb: { xs: "40px", md: 0 },
      }}
    >
      <LandingImage />
      <Stack gap={6}>
        <Stack gap={5}>
          <Box>
            <Typography
              fontSize={{ xs: 32, md: 38 }}
              fontWeight={400}
              color={"#2A2A3C"}
            >
              Empower Your
            </Typography>
            <Typography
              fontSize={{ xs: 60, md: 62 }}
              fontWeight={300}
              lineHeight={"120%"}
              color={"#2A2A3C"}
              display={"flex"}
              flexWrap={{ xs: "wrap", lg: "nowrap" }}
              columnGap={2}
            >
              <Box
                component="span"
                color={"#3A6BCE"}
              >
                Writing{" "}
              </Box>
              Endeavors
            </Typography>
          </Box>
          <Typography
            fontSize={{ xs: 18, md: 18 }}
            fontWeight={400}
            color={"#2A2A3C"}
          >
            Elevate your content, irrespective of your domain: from academic assignments to business communications
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          flexWrap={"wrap"}
          gap={2}
        >
          <Button
            startIcon={<Google />}
            endIcon={socialOpened ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            variant="contained"
            sx={{
              p: "10px 24px",
              borderRadius: "99px",
              fontWeight: 500,
              bgcolor: "#1F1F1F",
            }}
            onClick={handleOpenSocial}
          >
            Continue with Google
          </Button>
          <Menu
            anchorEl={socialAnchor}
            open={socialOpened}
            onClose={handleCloseSocial}
            sx={{
              ".MuiPaper-root": {
                borderRadius: "20px",
              },
              ".MuiList-root": {
                p: 0,
              },
            }}
          >
            <SocialMediaAuth asList />
          </Menu>
          <Button
            variant="outlined"
            LinkComponent={Link}
            href={BLOG_URL}
            target="_blank"
            sx={{ color: "#67677C" }}
          >
            or Learn more
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Landing;
