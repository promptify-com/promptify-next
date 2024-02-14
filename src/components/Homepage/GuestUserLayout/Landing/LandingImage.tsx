import Box from "@mui/material/Box";
import Image from "@/components/design-system/Image";
import { isDesktopViewPort } from "@/common/helpers";
import { Typography } from "@mui/material";

function LandingImage() {
  const isDesktop = isDesktopViewPort();

  return (
    <Box position={"relative"}>
      <Box
        sx={{
          position: "absolute",
          zIndex: 0,
          top: 0,
          left: "25px",
          width: "120px",
          height: "120px",
          bgcolor: "#E7F7FF",
          borderRadius: "50%",
        }}
      />
      <Image
        src={require("./empower-2.jpeg")}
        alt={"Promptify"}
        priority={true}
        style={{
          position: "relative",
          zIndex: 1,
          margin: "0 55px",
          height: "auto",
          width: isDesktop ? "353px" : "253px",
          objectFit: "cover",
          borderRadius: "999px 999px 0 0",
        }}
      />
      <Image
        src={require("./empower-1.jpeg")}
        alt={"Promptify"}
        priority={true}
        style={{
          position: "absolute",
          zIndex: 2,
          bottom: "-20px",
          left: 0,
          height: "185px",
          width: "190px",
          objectFit: "cover",
          borderRadius: "999px 999px 0px",
        }}
      />
      <Typography
        sx={{
          ...textStyle,
          width: "163px",
        }}
      >
        Help me write new <span className="active">article</span> for my blog...
      </Typography>
      <Typography
        sx={{
          ...textStyle,
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        a <span className="active">nouvelle</span>...
      </Typography>
      <Typography
        sx={{
          ...textStyle,
          top: "unset",
          bottom: "50px",
          left: "120px",
        }}
      >
        Let&apos;s create <span className="active">character</span>...
      </Typography>
    </Box>
  );
}

const textStyle = {
  position: "absolute",
  top: "90px",
  zIndex: 4,
  width: "fit-content",
  bgcolor: "#FFFFFF",
  fontSize: { md: 16 },
  fontWeight: 400,
  color: "#2A2A3C",
  p: "8px 16px 8px 22px",
  borderRadius: "24px",
  boxShadow:
    "0px 8px 9px -5px rgba(225, 226, 236, 0.20), 0px 15px 22px 2px rgba(225, 226, 236, 0.14), 0px 6px 28px 5px rgba(27, 27, 30, 0.12)",
  ".active": {
    display: "inline-block",
    color: "#3A6BCE",
  },
};

export default LandingImage;
