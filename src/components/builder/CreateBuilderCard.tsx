import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ICreateBuilderLink } from "@/components/builder/Types";
import Group from "./Assets/Group";
import { ArrowBackIosRounded, ArrowForwardIosRounded, Bolt } from "@mui/icons-material";

interface Props {
  link: ICreateBuilderLink;
}
function CreateBuilderCard({ link }: Props) {
  const { type, href, label } = link;
  return (
    <Link
      href={href}
      style={{ textDecoration: "none" }}
    >
      <Stack
        border={"1px solid"}
        borderColor={"surfaceDim"}
        borderRadius={"16px"}
        p={"16px 24px"}
        gap={3}
        overflow={"hidden"}
        sx={{
          width: "276px",
          cursor: type === "NEW" ? "pointer" : "not-allowed",
          ...(type === "NEW" && {
            ":hover": {
              borderColor: "primary.main",
            },
          }),
        }}
      >
        <Box
          height={"72px"}
          width={"72px"}
          bgcolor={"surface.2"}
          borderRadius={"16px"}
          alignContent={"center"}
          sx={{
            opacity: type === "GPT" ? 0.5 : 1,
          }}
        >
          {type === "NEW" && (
            <Stack
              direction={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={1}
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <Group key={index} />
              ))}
            </Stack>
          )}
          {type === "GPT" && (
            <Stack
              direction={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={1}
            >
              <Group />
              <Stack
                width={"56px"}
                height={"24px"}
                bgcolor={"primary.main"}
                borderRadius={"2px"}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <ArrowBackIosRounded
                  sx={{
                    color: "onPrimary",
                    fontSize: "13px",
                  }}
                />
                <Bolt
                  sx={{
                    color: "onPrimary",
                    fontSize: "20px",
                  }}
                />
                <ArrowForwardIosRounded
                  sx={{
                    color: "onPrimary",
                    fontSize: "13px",
                  }}
                />
              </Stack>
            </Stack>
          )}
        </Box>

        <Typography
          fontSize={16}
          fontWeight={500}
          lineHeight={"19.2px"}
          letterSpacing={"0.17px"}
          color={type === "NEW" ? "onSurface" : "surfaceDim"}
        >
          {label}
        </Typography>
      </Stack>
    </Link>
  );
}

export default CreateBuilderCard;
