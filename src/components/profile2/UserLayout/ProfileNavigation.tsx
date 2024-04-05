import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Link from "next/link";
import { navItems } from "@/components/profile2/Constants";
import Button from "@mui/material/Button";

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

  const justifyContent = prevItem && nextItem ? "center" : prevItem ? "flex-start" : nextItem ? "flex-end" : "center";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: justifyContent,
        alignItems: "flex-start",
        gap: "16px",
        alignSelf: "stretch",
        m: "20px",
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
          <Button
            component="a"
            sx={btnStyle}
            startIcon={<ArrowBackIosNewRoundedIcon sx={{ color: "onSurface" }} />}
          >
            <Typography sx={btnTypographyStyle}>{prevItem?.title}</Typography>
          </Button>
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
          <Button
            component="a"
            sx={btnStyle}
            endIcon={<ArrowForwardIosRoundedIcon sx={{ color: "onSurface" }} />}
          >
            <Typography sx={btnTypographyStyle}>{nextItem?.title}</Typography>
          </Button>
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
  borderRadius: "99px",
  border: "1px solid",
  borderColor: "surfaceContainerHigh",
  textDecoration: "none",
};

const btnTypographyStyle = {
  color: "onSurface",
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontFamily: "Poppins",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 500,
  lineHeight: "150%",
  display: "inline",
  minWidth: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  "&:hover": {
    color: "onSurface",
    borderColor: "onSurface",
  },
};

export default ProfileNavigation;
