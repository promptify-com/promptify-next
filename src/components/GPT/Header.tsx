import Stack from "@mui/material/Stack";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material";

import { theme } from "@/theme";
import Image from "@/components/design-system/Image";
import { ElectricBoltIcon } from "@/assets/icons/ElectricBoltIcon";
import DatePickerCalendar from "../GPTs/DatePickerCalendar";
import type { IWorkflow } from "@/components/Automation/types";

interface Props {
  workflow: IWorkflow;
}

export default function Header({ workflow }: Props) {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        p: "64px 48px",
        borderBottom: "1px solid #ECECF3",
        background: "linear-gradient(0deg, rgba(255, 255, 255, 0.00) 0%, rgba(110, 69, 233, 0.05) 100%), #FFF;",
      }}
    >
      <Stack gap={6}>
        <CardMedia
          sx={{
            width: { xs: 32, sm: 48 },
            height: { xs: 32, sm: 48 },
            p: "32px",
            borderRadius: "24px",
            border: "1px solid",
            borderColor: "surfaceContainerHigh",
          }}
        >
          <Image
            src={workflow.image ?? require("@/assets/images/default-thumbnail.jpg")}
            alt={workflow.name}
            style={{ borderRadius: "16%", objectFit: "contain", width: "100%", height: "100%" }}
            priority={true}
          />
        </CardMedia>
        <Stack gap={3}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={0.5}
            sx={{
              width: "fit-content",
              bgcolor: "common.black",
              borderRadius: "99px",
              p: "4px 10px",
              fontSize: 12,
              fontWeight: 500,
              color: "common.white",
            }}
          >
            <ElectricBoltIcon
              color="#FFF"
              small
            />
            GPT
          </Stack>
          <Typography
            fontSize={40}
            fontWeight={500}
            color={"onSurface"}
          >
            {workflow.name}
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={400}
            color={"onSurface"}
          >
            {workflow.description}
          </Typography>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={2}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: "onSurface",
            }}
          >
            Status:
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={1}
              sx={{
                p: "6px 14px",
                bgcolor: "#E5FFD5",
                border: "1px solid #77B94E33",
                borderRadius: "99px",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: "#77B94E",
                  borderRadius: "50%",
                }}
              />
              Active
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={2}
            sx={{
              fontSize: 14,
              fontWeight: 400,
              color: alpha(theme.palette.onSurface, 0.5),
            }}
          >
            Scheduled: Daily @ 9:00 AM
            <IconButton sx={{}}>
              <SettingsOutlined />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <DatePickerCalendar workflowId={"11"} />
    </Stack>
  );
}
