import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { StickyNote2Icon } from "@/assets/icons/StickyNote2Icon";
import { DeployedCodeIcon } from "@/assets/icons/DeployedCodeIcon";
import { ElectricBoltIcon } from "@/assets/icons/ElectricBoltIcon";

interface IServiceCard {
  title: string;
  icon: React.JSX.Element;
  description: string;
  link: {
    title: string;
    path: string;
  };
}

const ServicesList: IServiceCard[] = [
  {
    title: "Prompt Library",
    icon: <StickyNote2Icon />,
    description:
      "From versatile templates to an intuitive design, we offer an unparalleled content generation experience",
    link: {
      title: "Browse Prompts",
      path: "/explore",
    },
  },
  {
    title: "Prompt Builder",
    icon: <DeployedCodeIcon />,
    description:
      "From versatile templates to an intuitive design, we offer an unparalleled content generation experience",
    link: {
      title: "Try Builder",
      path: "/signin",
    },
  },
  {
    title: "AI Apps",
    icon: <ElectricBoltIcon />,
    description:
      "Seamlessly integrate our services into your applications. Plus, use our Chrome extension for AI-powered writing on",
    link: {
      title: "Learn more",
      path: "/automation",
    },
  },
];

function Services() {
  return (
    <Stack
      direction={{ md: "row" }}
      justifyContent={"center"}
      alignItems={"flex-start"}
      gap={4}
      sx={{
        py: { xs: "30px", md: "48px" },
      }}
    >
      {ServicesList.map(service => (
        <Stack
          key={service.title}
          gap={4}
          p={"16px"}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={2}
          >
            <Icon
              sx={{
                height: 72,
                width: 72,
                bgcolor: "#F7F6FE",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                svg: {
                  width: 48,
                  height: 48,
                },
              }}
            >
              {service.icon}
            </Icon>
            <Typography
              fontSize={18}
              fontWeight={500}
              color={"secondary.main"}
            >
              {service.title}
            </Typography>
          </Stack>
          <Stack
            alignItems={"flex-start"}
            gap={2}
          >
            <Typography
              fontSize={16}
              fontWeight={400}
              color={"secondary.main"}
            >
              {service.description}
            </Typography>
            <Button
              LinkComponent={Link}
              href={service.link.path}
              sx={{
                padding: "8px 24px",
                borderRadius: "99px",
                fontSize: 14,
                fontWeight: 500,
                backgroundColor: "#1F1F1F",
                color: "#FFF",
                textDecoration: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  transition: "all 0.3s ease",
                  borderRadius: "99px",
                  color: "#FFF",
                  border: 0,
                  background:
                    "linear-gradient(0deg, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.20) 100%), var(--inverseSurface, #303034)",
                },
              }}
            >
              {service.link.title}
            </Button>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

export default Services;
