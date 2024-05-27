import Stack from "@mui/material/Stack";
import Image from "@/components/design-system/Image";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { IMessage } from "@/components/Prompt/Types/chat";
import { useAppSelector } from "@/hooks/useStore";
import { LogoApp } from "@/assets/icons/LogoApp";

interface Props {
  message: IMessage;
}

export default function Message({ message }: Props) {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { fromUser, isHighlight, noHeader } = message;
  console.log(message);

  return (
    <Stack
      direction={"row"}
      alignItems={"flex-start"}
      gap={2}
    >
      <CardMedia
        sx={{
          width: 40,
          height: 40,
          p: "1px",
          borderRadius: "50%",
          border: noHeader ? "none" : "1px solid",
          borderColor: fromUser ? "#5ED3B0" : "#E9E7EC",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!noHeader &&
          (fromUser ? (
            <Image
              src={currentUser?.avatar ?? require("@/assets/images/default-thumbnail.jpg")}
              alt={currentUser?.username ?? currentUser?.first_name ?? "You"}
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          ) : (
            <LogoApp width={20} />
          ))}
      </CardMedia>
      <Stack gap={2}>
        <Typography
          fontSize={14}
          fontWeight={500}
          color={"onSurface"}
          sx={{
            p: "16px 20px",
            borderRadius: fromUser ? "100px 100px 100px 0px" : "0px 100px 100px 100px",
            bgcolor: isHighlight ? "#DFDAFF" : "#F8F7FF",
          }}
        >
          {message.text}
        </Typography>
      </Stack>
    </Stack>
  );
}
