import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { NavigateNext } from "@mui/icons-material";
import { theme } from "@/theme";

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface BreadcrumbProps {
  crumbs: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ crumbs }) => {
  return (
    <Breadcrumbs
      separator={<NavigateNext />}
      aria-label="breadcrumb"
      color="onSurface"
    >
      {crumbs.map((crumb, index) => (
        <span key={index}>
          {crumb.link ? (
            <Link
              href={crumb.link}
              style={{ fontSize: "19px", color: theme.palette.onSurface, textDecoration: "none" }}
            >
              {crumb.label}
            </Link>
          ) : (
            <Typography
              color="onSurface"
              fontSize={19}
              sx={{ textTransform: "capitalize" }}
            >
              {crumb.label}
            </Typography>
          )}
        </span>
      ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
