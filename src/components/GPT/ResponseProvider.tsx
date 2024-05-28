import { useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import { PROVIDERS } from "./Constants";
import { getNodeInfoByType } from "@/components/GPTs/helpers";

interface Props {
  providerType: string;
}

function ResponseProvider({ providerType }: Props) {
  const [connected, setConnected] = useState(false);

  const providerData = useMemo(() => {
    const node = getNodeInfoByType(providerType);
    const provider = PROVIDERS[providerType as keyof typeof PROVIDERS];
    return { ...provider, ...node };
  }, [providerType]);

  const handleConnect = () => {
    setConnected(true);
  };

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      gap={2}
      sx={{
        p: "24px",
        borderRadius: "16px",
        border: "1px solid",
        borderColor: connected ? "#4EB972" : "#E9E7EC",
        bgcolor: connected ? "#F2FFF7" : "#FFFFFF",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={3}
      >
        <CardMedia
          sx={{
            width: 16,
            height: 16,
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
              `${process.env.NEXT_PUBLIC_N8N_CHAT_BASE_URL}/${providerData.iconUrl}` ??
              require("@/assets/images/default-avatar.jpg")
            }
            alt={providerData.name}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          />
        </CardMedia>
        <Typography
          fontSize={16}
          fontWeight={500}
          color={"onSurface"}
        >
          {providerData.name}
        </Typography>
      </Stack>
      {connected ? (
        <Button
          onClick={handleConnect}
          variant="contained"
          sx={btnStyle}
        >
          Add
        </Button>
      ) : (
        <Button
          onClick={handleConnect}
          variant="contained"
          sx={btnStyle}
        >
          Connect
        </Button>
      )}
    </Stack>
  );
}

export default ResponseProvider;

const btnStyle = {
  bgcolor: "#6E45E9",
  color: "common.white",
  fontSize: 13,
  fontWeight: 500,
  p: "10px 24px",
  ":hover": {
    bgcolor: "#5632c2",
    color: "common.white",
  },
};
