import { useRef } from "react";
import { CategoriesSection } from "../../explorer/CategoriesSection";
import { TemplatesSection } from "../../explorer/TemplatesSection";
import { WelcomeCard } from "../WelcomeCard";
import useToken from "@/hooks/useToken";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import { useGetTemplatesByFilterQuery } from "../../../core/api/templates";
import { Category } from "../../../core/api/dto/templates";
import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "../../design-system/Image";
import SigninButton from "../../common/buttons/SigninButton";
import { Google } from "../../../assets/icons/google";
import { KeyboardArrowDown } from "@mui/icons-material";

const ioLatestsOptions = {
  threshold: 0,
  rootMargin: "150px",
  disconnectNodeOnceVisible: true,
};
const ioPopularOptions = {
  threshold: 0.5,
  rootMargin: "100px",
  disconnectNodeOnceVisible: true,
};

function GuestUserLayout({ categories }: { categories: Category[] }) {
  const token = useToken();
  const latestTemplatesRef = useRef<HTMLDivElement | null>(null);
  const popularTemplatesRef = useRef<HTMLDivElement | null>(null);
  const latestTemplatesEntry = useIntersectionObserver(latestTemplatesRef, ioLatestsOptions);
  const popularTemplatesEntry = useIntersectionObserver(popularTemplatesRef, ioPopularOptions);
  const { data: popularTemplates } = useGetTemplatesByFilterQuery(
    {
      ordering: "-runs",
      limit: 7,
    },
    {
      skip: token || !popularTemplatesEntry?.isIntersecting,
    },
  );
  const { data: latestTemplates } = useGetTemplatesByFilterQuery(
    {
      ordering: "-created_at",
      limit: 7,
    },
    {
      skip: token || !latestTemplatesEntry?.isIntersecting,
    },
  );

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={3}
        sx={{
          minHeight: "80svh",
          maxWidth: "90%",
          m: "auto",
        }}
      >
        <Image
          src={require("./empower.png")}
          alt={"Promptify"}
          width={360}
        />
        <Stack gap={6}>
          <Stack gap={5}>
            <Box>
              <Typography
                fontSize={48}
                fontWeight={400}
                color={"#2A2A3C"}
              >
                Empower Your
              </Typography>
              <Typography
                fontSize={72}
                fontWeight={300}
                color={"#2A2A3C"}
                display={"flex"}
                flexWrap={"wrap"}
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
              fontSize={24}
              fontWeight={400}
              color={"#2A2A3C"}
            >
              Elevate your content, irrespective of your domain: from academic assignments to business communications
            </Typography>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={2}
          >
            <Button
              startIcon={<Google />}
              endIcon={<KeyboardArrowDown />}
              variant="contained"
              sx={{
                p: "10px 24px",
                borderRadius: "99px",
                fontWeight: 500,
                bgcolor: "#1F1F1F",
              }}
            >
              Continue with Google
            </Button>
            <Button variant="outlined">or Learn more</Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default GuestUserLayout;
