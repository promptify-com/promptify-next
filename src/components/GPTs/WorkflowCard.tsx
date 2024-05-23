import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";

import Image from "@/components/design-system/Image/";
import StatusChip from "@/components/GPTs/StatusChip";
import BoltOutlined from "@/components/GPTs/Icons/BoltOutlined";

function WorkflowCard({ index }: { index: number }) {
  return (
    <Stack
      flex={1}
      p={"8px"}
      width={{ xs: "282px", md: "487px" }}
      minWidth={{ xs: "282px", md: "487px" }}
      direction={{ xs: "column", md: "row" }}
      bgcolor={"#F9F9F9"}
      borderRadius={"16px"}
      position={"relative"}
    >
      <Box
        width={{ xs: "100%", md: "180px" }}
        height={{ xs: "266px", md: "180px" }}
        borderRadius={"18px"}
        overflow={"hidden"}
        position={"relative"}
      >
        <Image
          src={"/assets/images/animals/City.jpg"}
          fill
          alt=""
        />
        <Stack
          direction={"row"}
          gap={"8px"}
          position={"absolute"}
          bottom={7}
          right={10}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={0.5}
            sx={iconTextStyle}
            className="icon-text-style"
          >
            <FavoriteBorderOutlined sx={{ fontSize: 12 }} /> 0
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={0.5}
            sx={iconTextStyle}
            className="icon-text-style"
          >
            <BoltOutlined
              size="12"
              color="#ffffff"
            />
            0
          </Stack>
        </Stack>
      </Box>
      <Stack
        position={"absolute"}
        top={{ xs: "24px", md: 7 }}
        right={{ xs: "24px", md: 7 }}
      >
        <StatusChip status={index === 2 ? "active" : "paused"} />
      </Stack>
      <Stack
        p={{ xs: "16px", md: "40px 24px 16px 24px" }}
        flex={1}
        gap={"24px"}
      >
        <Stack gap={"8px"}>
          <Typography
            fontSize={"16px"}
            fontWeight={500}
            color={"#000"}
            lineHeight={"120%"}
          >
            Get a city’s weather
          </Typography>
          <Typography
            fontSize={11}
            fontWeight={400}
            lineHeight={"150%"}
            color={"#000"}
          >
            Comprehensive and structured scientific essay. Introduction, three-...
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
        >
          <Typography
            fontSize={11}
            fontWeight={400}
            lineHeight={"150%"}
            color={"#000"}
          >
            Scheduled: Daily @ 9:00 AM
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

const iconTextStyle = {
  fontSize: 13,
  fontWeight: 400,
  color: "white",
  bgcolor: "rgba(0, 0, 0, 0.8)",
  borderRadius: "100px",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  padding: "0px 12px",
  height: "26px",
  svg: {
    fontSize: 12,
  },
};

export default WorkflowCard;
