import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import { BtnStyle } from "./Constants";
import Check from "@mui/icons-material/Check";

interface Props {
  iconUrl: string;
  name: string;
  isConnected: boolean;
  isInjected: boolean;
  onConnect?(): void;
  onInject?(): void;
}

function ProviderCard({ iconUrl, name, isConnected, isInjected, onConnect, onInject }: Props) {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={2}
      sx={{
        height: "calc(100% - 48px)",
        p: "24px",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: isInjected ? "#4EB972" : isConnected ? "#6E45E9" : "#E9E7EC",
        bgcolor: isInjected ? "#F2FFF7" : isConnected ? "#F7F5FC" : "#FFFFFF",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={2}
      >
        <CardMedia
          sx={{
            width: 22,
            height: 22,
            p: "9px",
            borderRadius: "50%",
            border: "1px solid",
            borderColor: "#E9E7EC",
            bgcolor: "#FFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={
              `${process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL}/${iconUrl}` ?? require("@/assets/images/default-avatar.jpg")
            }
            alt={name}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        </CardMedia>
        <Stack
          flex={1}
          alignItems={"flex-start"}
          gap={1}
        >
          {isConnected && !isInjected && (
            <Typography
              fontSize={10}
              fontWeight={600}
              color={"#6E45E9"}
              textTransform={"uppercase"}
              letterSpacing={".5px"}
            >
              Previously Connected
            </Typography>
          )}
          <Typography
            fontSize={16}
            fontWeight={500}
            color={"onSurface"}
          >
            {name}
          </Typography>
        </Stack>
      </Stack>
      {isInjected ? (
        <Check
          sx={{
            width: 18,
            height: 18,
            p: "7px",
            borderRadius: "50%",
            bgcolor: "#4EB972",
            color: "#FFF",
          }}
        />
      ) : isConnected ? (
        <Button
          onClick={onInject}
          variant="contained"
          sx={BtnStyle}
        >
          Add
        </Button>
      ) : (
        <Button
          onClick={onConnect}
          variant="contained"
          sx={BtnStyle}
        >
          Connect
        </Button>
      )}
    </Stack>
  );
}

export default ProviderCard;
