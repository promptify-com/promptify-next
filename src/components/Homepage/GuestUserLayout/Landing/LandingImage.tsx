import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Head from "next/head";
import useBrowser from "@/hooks/useBrowser";

function LandingImage() {
  const { isMobile } = useBrowser();

  const renderImageByViewport = !isMobile
    ? "/assets/images/Homepage/empower-2-desktop.webp"
    : "/assets/images/Homepage/empower-2-mobile.webp";

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={renderImageByViewport}
          as="image"
          type="image/webp"
          imageSrcSet="/assets/images/Homepage/empower-2-mobile.webp 253w, /assets/images/Homepage/empower-2-desktop.webp 353w"
          imageSizes="(max-width: 600px) 253px, (max-width: 900px) 253px, 353px"
          placeholder="blur"
        />
      </Head>
      <Box
        position={"relative"}
        minHeight={"60svh"}
      >
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
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            margin: "0 55px",
            width: !isMobile ? "353px" : "253px",
            height: !isMobile ? "408px" : "293px",
            borderRadius: "999px 999px 0 0",
            overflow: "hidden",
          }}
        >
          <Image
            src={renderImageByViewport}
            alt="Promptify"
            priority={true}
            fill
            sizes="(max-width: 600px) 253px, (max-width: 900px) 253px, 353px"
            style={{ objectFit: "cover" }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            zIndex: 2,
            bottom: "-20px",
            left: 0,
            height: "185px",
            width: "190px",
            borderRadius: "999px 999px 0",
            overflow: "hidden",
          }}
        >
          <Image
            src="/assets/images/Homepage/empower-1.webp"
            alt="Promptify"
            priority={true}
            fill
            sizes="190px"
            style={{ objectFit: "cover" }}
          />
        </Box>
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
    </>
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
