import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";

function AdsBox() {
  const router = useRouter();
  return (
    <Stack
      sx={{
        position: "relative",
        zIndex: 1,
        borderRadius: "24px",
        overflow: "hidden",
        width: { xs: "100%", md: "94%" },
        height: "275px",
        ml: { xs: 0, md: 2 },
      }}
    >
      <Image
        src={"/assets/images/Homepage/TryGPT.webp"}
        alt={"Promptify"}
        fill
        sizes="(max-width: 600px) 344px, (max-width: 900px) 437px, 437px"
        priority={true}
      />
      <Stack
        direction={"column"}
        position={"absolute"}
        top={"54px"}
        left={{ xs: "16px", md: "54px" }}
        zIndex={4}
        gap={2}
      >
        <Typography
          fontSize={36}
          color={"onPrimary"}
          lineHeight={"50.4px"}
        >
          Try AI Apps
        </Typography>

        <Typography
          fontSize={18}
          fontWeight={500}
          color={"onPrimary"}
          lineHeight={"28px"}
        >
          Custom and <br /> powerful AI apps
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/apps")}
          sx={{
            bgcolor: "inverseSurface",
            borderColor: "inverseSurface",
            width: "100px",
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "24px",
            "&:hover": {
              bgcolor: "primary.main",
              borderColor: "primary.main",
              color: "onPrimary",
            },
          }}
        >
          See now
        </Button>
      </Stack>
    </Stack>
  );
}

export default AdsBox;
