import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";

interface Props {
  title: string;
  thumbnail: string | undefined;
}

function ChatHeading({ title, thumbnail }: Props) {
  return (
    <Stack
      sx={{
        height: { xs: 120, md: 230 },
        p: "8px",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
      >
        <Box
          sx={{
            zIndex: 0,
            position: "relative",
            minWidth: "40px",
            height: "40px",
            borderRadius: "40px",
            overflow: "hidden",
          }}
        >
          <Image
            src={thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
            alt={"Image 1"}
            priority={true}
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
        <Box>
          <Typography
            fontSize={16}
            fontWeight={400}
            lineHeight={"18px"}
            letterSpacing={"0.2px"}
            sx={{
              opacity: 0.6,
            }}
          >
            Chat:
          </Typography>
          <Typography
            fontSize={{ xs: 19, md: 24 }}
            fontWeight={400}
            lineHeight={{ md: "38.4px" }}
            letterSpacing={"0.17px"}
          >
            {title}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default ChatHeading;
