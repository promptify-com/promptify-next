import { LogoApp } from "@/assets/icons/LogoApp";
import { XIcon } from "@/assets/icons/XIcon";
import { FacebookIcon } from "@/assets/icons/FbIcon";
import { LinkedinIcon } from "@/assets/icons/Linkedin";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Box from "@mui/material/Box";

const Links = [
  { title: "Privacy Policy", href: "https://blog.promptify.com/post/privacy-policy" },
  { title: "Terms of Use", href: "https://blog.promptify.com/post/terms-of-use" },
  { title: "Support", href: "#" },
];

const socialLinks = [
  { title: "Facebook", href: "#", icon: <FacebookIcon /> },
  { title: "Twitter", href: "#", icon: <XIcon /> },
  { title: "LinkedIn", href: "https://www.linkedin.com/company/promptify-com/about/", icon: <LinkedinIcon /> },
];

const thisYear = new Date().getFullYear();

const commonBoxStyles = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 16px",
  borderRadius: "99px",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "surface.2",
  },
};

function FooterPrompt() {
  return (
    <>
      <Divider />
      <Stack
        display={"flex"}
        p={"32px var(--none, 0px)"}
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
            <>
              {Links.map((link, index) => (
                <Box
                  key={index}
                  sx={commonBoxStyles}
                >
                  <Link
                    href={link.href}
                    style={{ textDecoration: "none" }}
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
            </>
          </Stack>
          <Stack
            flexDirection={{ xs: "column", md: "row" }}
            gap={"8px"}
          >
            {socialLinks.map((link, index) => (
              <Box
                key={index}
                sx={commonBoxStyles}
              >
                <Link
                  href={link.href}
                  key={index}
                  target="_blank"
                >
                  {link.icon}
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
            }}
          >
            © {thisYear} Promptify.com - Promptify LLC. All rights reserved.
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}

export default FooterPrompt;
