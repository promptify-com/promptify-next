import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Link from "next/link";
import { navItems } from "@/components/profile2/Constants";

interface NavItem {
  title: string;
  link: string;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

const flattenNavItems = (navItems: NavGroup[]): NavItem[] => {
  return navItems.reduce<NavItem[]>((acc, item) => {
    const items = item.items.map(subItem => ({
      title: subItem.title,
      link: subItem.link,
    }));
    return [...acc, ...items];
  }, []);
};

const ProfileNavigation = () => {
  const router = useRouter();
  const flatNavItems = flattenNavItems(navItems);

  const currentIndex = flatNavItems.findIndex(item => item.link === router.pathname);
  const prevItem = flatNavItems[currentIndex - 1];
  const nextItem = flatNavItems[currentIndex + 1];

  return (
    <Box
      sx={{
        display: "flex",
        padding: "16px",
        justifyContent: prevItem ? "center" : "flex-end",
        alignItems: "flex-start",
        gap: "16px",
        alignSelf: "stretch",
      }}
    >
      {prevItem && (
        <Link
          href={prevItem.link}
          passHref
          style={{
            textDecoration: "none",
          }}
        >
          <IconButton
            component="a"
            sx={btnStyle}
          >
            <ArrowBackIosNewRoundedIcon />
            <Typography sx={btnTypographyStyle}>{prevItem?.title}</Typography>
          </IconButton>
        </Link>
      )}
      {nextItem && (
        <Link
          href={nextItem.link}
          passHref
          style={{
            textDecoration: "none",
          }}
        >
          <IconButton
            component="a"
            sx={btnStyle}
          >
            <Typography sx={btnTypographyStyle}>{nextItem?.title}</Typography>
            <ArrowForwardIosRoundedIcon />
          </IconButton>
        </Link>
      )}
    </Box>
  );
};

const btnStyle = {
  display: "flex",
  padding: "12px 24px",
  flexDirection: "row",
  gap: "8px",
  justifyContent: "center",
  alignItems: "center",
  flex: "1 0 0",
  borderRadius: "99px",
  border: "1px solid var(--surfaceContainerHigh, #E9E7EC)",
  textDecoration: "none",
};

const btnTypographyStyle = {
  color: "var(--onSurface, var(--onSurface, #1B1B1F))",
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontFamily: "Poppins",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "150%",
  display: "inline",
  maxWidth: "120px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  "&:hover": {
    color: "onSurface",
    borderColor: "onSurface",
  },
};

export default ProfileNavigation;
