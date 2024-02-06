import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "../../design-system/Image";
import { Google } from "../../../assets/icons/google";
import { KeyboardArrowDown } from "@mui/icons-material";

function Landing() {
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={3}
        sx={{
          minHeight: "60svh",
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
            <Button
              variant="outlined"
              sx={{ color: "#67677C" }}
            >
              or Learn more
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

export default Landing;
