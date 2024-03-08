import { LogoApp } from "@/assets/icons/LogoApp";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Box from "@mui/material/Box";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { IconButton } from "@mui/material";

const Links = [
  { title: "Privacy Policy", href: "https://blog.promptify.com/post/privacy-policy" },
  { title: "Terms of Use", href: "https://blog.promptify.com/post/terms-of-use" },
  { title: "Support", href: "#" },
];

const socialLinks = [
  { title: "Twitter", href: "#", icon: <XIcon style={{ fill: "#1B1B1F" }} /> },
  { title: "Facebook", href: "#", icon: <FacebookIcon style={{ fill: "#1B1B1F" }} /> },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/company/promptify-com/about/",
    icon: <LinkedInIcon style={{ fill: "#1B1B1F" }} />,
  },
];

const thisYear = new Date().getFullYear();

function FooterPrompt() {
  return (
    <Stack
      width={"95%"}
      margin={"auto"}
    >
      <Divider />
      <Stack
        display={"flex"}
        p={"32px 0px"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        alignSelf={"stretch"}
        bgcolor={"surface.1"}
        m={{ sm: "auto", md: 0 }}
        width={{ xs: "100%", sm: "80%", md: "100%" }}
      >
        <Stack
          display={"flex"}
          width={"100%"}
          justifyContent={{ xs: "center", md: "space-between" }}
          alignItems={"center"}
          flexDirection={{ xs: "column", md: "row" }}
          gap={"24px"}
        >
          <Stack
            flexDirection={{ xs: "column", md: "row" }}
            gap={{ xs: "16px", md: "48px" }}
            alignItems={"center"}
          >
            <Stack flexDirection={"row"}>
              <LogoApp
                width={23}
                color="#1B1B1F"
              />
              <Typography
                sx={{ fontSize: 19, ml: 1 }}
                fontWeight={500}
              >
                Promptify
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
            >
              {Links.map((link, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "99px",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                  p={"12px 16px"}
                >
                  <Link
                    href={link.href}
                    style={{ textDecoration: "none" }}
                    target="_blank"
                  >
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 500,
                        lineHeight: "150%",
                        color: "onSurface",
                        fontFeatureSettings: "'clig' off, 'liga' off",
                      }}
                    >
                      {link.title}
                    </Typography>
                  </Link>
                </Box>
              ))}
            </Stack>
          </Stack>
          <Stack
            flexDirection={"row"}
            gap={"8px"}
          >
            {socialLinks.map((link, index) => (
              <Box key={index}>
                <Link
                  href={link.href}
                  key={index}
                  target="_blank"
                >
                  <IconButton
                    sx={{
                      border: "none",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {link.icon}
                  </IconButton>
                </Link>
              </Box>
            ))}
          </Stack>
        </Stack>
        <Stack
          display={"flex"}
          width={"100%"}
          p={"var(--2, 16px) var(--3, 24px)"}
          alignItems={{ xs: "center", md: "flex-start" }}
          gap={"24px"}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "160%",
              letterSpacing: "0.17px",
              color: "#575E71",
              fontFeatureSettings: "'clig' off, 'liga' off",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            © {thisYear} Promptify.com - Promptify LLC. All rights reserved.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default FooterPrompt;
