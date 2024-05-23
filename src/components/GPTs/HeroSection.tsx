import { Search } from "@mui/icons-material";
import { InputBase, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Image from "../design-system/Image";
import BoltOutlined from "./Icons/BoltOutlined";
import useBrowser from "@/hooks/useBrowser";

function HeroSection() {
  const { isMobile } = useBrowser();

  const renderImageByViewport = !isMobile
    ? "/assets/images/GPTs/GPTs-hero-desktop.webp"
    : "/assets/images/GPTs/GPTs-hero-mobile.webp";
  return (
    <Stack
      pt={{ xs: 13, md: 0 }}
      direction={{ xs: "column", md: "row" }}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{
        background: "linear-gradient(0deg, rgba(255, 255, 255, 0.00) 0%, rgba(110, 69, 233, 0.05) 100%), #FFF",
        borderBottom: "1px solid #ECECF3",
      }}
      pl={{ xs: "0px", md: "80px" }}
      gap={"40px"}
    >
      <Stack
        gap={"24px"}
        width={{ md: "40%" }}
        maxWidth={{ md: "487px" }}
        px={{ xs: "24px", md: 0 }}
      >
        <Box
          width={"56px"}
          height={"56px"}
          bgcolor={"white"}
          borderRadius={"56px"}
          border={" 1px solid #6E45E9"}
          color={"#6E45E9"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <BoltOutlined
            size="26"
            color="#6E45E9"
          />
        </Box>
        <Typography
          fontSize={{ xs: 40, md: 64 }}
          fontWeight={500}
          lineHeight={"120%"}
        >
          GPTs
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={400}
          lineHeight={"150%"}
          color={"#000"}
          sx={{ opacity: 0.75 }}
        >
          Discover advanced Generative AI that combine sophisticated prompt templates, set of instructions, extra
          knowledge, and any combination of skills.
        </Typography>
        <Box
          border={"1px solid #E3E3EC"}
          borderRadius={"100px"}
          p={"16px 32px"}
          bgcolor={"white"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          maxWidth={"80%"}
        >
          <InputBase
            placeholder="Search for GPTs"
            fullWidth
            sx={{
              color: "#000",
              ".MuiInputBase-input::placeholder": {
                color: "#000",
                opacity: 0.75,
                fontSize: 14,
              },
            }}
          />
          <Search />
        </Box>
      </Stack>
      <Box
        width={{ xs: "100%", md: "50%" }}
        maxWidth={"682px"}
        height={{ xs: "350px", md: "492px" }}
        position={"relative"}
        overflow={"hidden"}
      >
        <Image
          fill
          src={renderImageByViewport}
          alt="GPTs-hero"
          priority={true}
          sizes="(max-width: 600px) 682px, (max-width: 900px) 682px, 682px"
        />
        <Box
          width={"100%"}
          position={"absolute"}
          height={"200px"}
          bottom={0}
          zIndex={555}
          sx={{
            background: "linear-gradient(0deg, #FFF 0%, rgba(254, 254, 255, 0.00) 100%)",
          }}
        />
      </Box>
    </Stack>
  );
}

export default HeroSection;
