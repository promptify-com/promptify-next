import { Breadcrumbs, Link, Typography } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";

interface BreadcrumbItem {
  label: string | string[] | undefined;
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
              color="onSurface"
              fontSize={19}
              href={crumb.link}
            >
              {crumb.label}
            </Link>
          ) : (
            <Typography
              color="onSurface"
              fontSize={19}
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
