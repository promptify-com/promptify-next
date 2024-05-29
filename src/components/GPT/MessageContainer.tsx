import Stack from "@mui/material/Stack";
import Image from "@/components/design-system/Image";
import CardMedia from "@mui/material/CardMedia";
import type { IMessage } from "@/components/Prompt/Types/chat";
import { useAppSelector } from "@/hooks/useStore";
import { LogoApp } from "@/assets/icons/LogoApp";
import { ReactNode } from "react";

interface Props {
  message: IMessage;
  children: ReactNode;
}

export default function MessageContainer({ message, children }: Props) {
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { fromUser, noHeader } = message;

  return (
    <Stack
      direction={fromUser ? "row-reverse" : "row"}
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
              src={currentUser?.avatar ?? require("@/assets/images/default-avatar.jpg")}
              alt={currentUser?.username ?? currentUser?.first_name ?? "You"}
              style={{ objectFit: "contain", width: "100%", height: "100%", borderRadius: "50%" }}
            />
          ) : (
            <LogoApp width={20} />
          ))}
      </CardMedia>
      <Stack
        flex={1}
        gap={2}
      >
        {children}
      </Stack>
    </Stack>
  );
}
