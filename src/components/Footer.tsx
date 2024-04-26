import Link from "next/link";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { LogoApp } from "@/assets/icons/LogoApp";

const Links = [
  { title: "Privacy Policy", href: "/privacy-policy" },
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

function Footer() {
  return (
    <Stack
      mt={{ xs: -3, md: 0 }}
      width={{ md: "95%" }}
      p={{ xs: "24px", sm: 0 }}
      margin={{ md: "auto" }}
      bgcolor={{ xs: "surfaceContainerLow", md: "surfaceContainerLowest" }}
    >
      <Divider />
      <Stack
        display={"flex"}
        p={"32px 0px"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        alignSelf={"stretch"}
        m={{ sm: "auto", md: 0 }}
        width={{ xs: "100%", sm: "80%", md: "100%" }}
      >
        <Stack
          display={"flex"}
          width={"100%"}
          justifyContent={{ xs: "space-between", md: "space-between" }}
          alignItems={{ md: "center" }}
          flexDirection={{ xs: "column", md: "row" }}
          gap={"24px"}
        >
          <Stack
            flexDirection={{ xs: "column", md: "row" }}
            gap={"48px"}
            alignItems={{ md: "center" }}
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
              ml={{ xs: -1.5, m: 0 }}
              alignItems={"center"}
              gap={1}
            >
              {Links.map((link, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: { xs: "between", md: "center" },
                    borderRadius: "99px",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                  p={{ xs: "0px 12px", md: "12px 16px" }}
                >
                  <Link
                    href={link.href}
                    style={{ textDecoration: "none" }}
                    target={link.href === "/privacy-policy" ? "_self" : "_blank"}
                    aria-label={link.title}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: 14, md: 16 },
                        fontWeight: 500,
                        lineHeight: { xs: "170%", md: "150%" },
                        color: "onSurface",
                        // fontFeatureSettings: "'clig' off, 'liga' off",
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
                  aria-label={link.title}
                >
                  <IconButton
                    sx={{
                      border: "none",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                    aria-label={link.title}
                  >
                    {link.icon}
                  </IconButton>
                </Link>
              </Box>
            ))}
          </Stack>
        </Stack>
        <Stack
          mt={"24px"}
          width={"100%"}
          direction={"row"}
          gap={"24px"}
        >
          <Typography
            sx={{
              fontSize: { xs: 12, md: 16 },
              fontWeight: 400,
              lineHeight: "160%",
              letterSpacing: "0.17px",
              color: "secondary.light",
              fontFeatureSettings: "'clig' off, 'liga' off",
            }}
          >
            © {thisYear} Promptify.com - Promptify LLC. All rights reserved.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Footer;
