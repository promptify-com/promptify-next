import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";

interface Props {
  title: string;
  avatar: string;
}

function ChatHeading({ title, avatar }: Props) {
  return (
    <Stack
      p={1}
      direction={"row"}
      alignItems={"center"}
      gap={2}
      pb={"130px"}
    >
      <Box
        sx={{
          zIndex: 0,
          position: "relative",
          width: "40px",
          height: "40px",
          borderRadius: "40px",
          overflow: "hidden",
        }}
      >
        <Image
          src={avatar}
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
          fontSize={24}
          fontWeight={400}
          lineHeight={"38.4px"}
          letterSpacing={"0.17px"}
        >
          {title}
        </Typography>
      </Box>
    </Stack>
  );
}

export default ChatHeading;
