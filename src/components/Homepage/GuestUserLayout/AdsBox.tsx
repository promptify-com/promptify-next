import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Image from "@/components/design-system/Image";

function AdsBox() {
  const router = useRouter();
  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        borderRadius: "24px",
        overflow: "hidden",
        width: { xs: "100%", md: "94%" },
        height: "275px",
        ml: { xs: 0, md: 2 },
        mt: "16px",
      }}
    >
      <Stack
        direction={"column"}
        position={"absolute"}
        top={"54px"}
        left={"54px"}
        zIndex={4}
        gap={2}
      >
        <Typography
          fontSize={38}
          color={"onPrimary"}
          lineHeight={"50.4px"}
        >
          Try GPT’s
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
          onClick={() => router.push("/automation")}
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
      <Image
        src={require("@/components/Homepage/GuestUserLayout/Landing/guestPage2.png")}
        alt={"Promptify"}
        fill
        priority={false}
      />
    </Box>
  );
}

export default AdsBox;
