import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Link from "next/link";
import { navItems } from "@/components/profile2/Constants";
import { IconButton } from "@mui/material";

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
        alignItems: "center",
        gap: "16px",
        alignSelf: "stretch",
        p: "16px",
      }}
    >
      {prevItem && (
        <Link
          href={prevItem.link}
          passHref
          style={{
            textDecoration: "none",
            width: "50%",
          }}
        >
          <IconButton
            component="a"
            sx={btnStyle}
          >
            <ArrowBackIosNewRoundedIcon sx={{ color: "onSurface" }} />
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
            width: "50%",
          }}
        >
          <IconButton
            component="a"
            sx={btnStyle}
          >
            <Typography sx={btnTypographyStyle}>{nextItem?.title}</Typography>
            <ArrowForwardIosRoundedIcon sx={{ color: "onSurface" }} />
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
  borderRadius: "99px",
  border: "1px solid",
  borderColor: "surfaceContainerHigh",
  textDecoration: "none",
  width: "100%",
};

const btnTypographyStyle = {
  color: "onSurface",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "150%",
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export default ProfileNavigation;
