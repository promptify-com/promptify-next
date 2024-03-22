import Link from "next/link";
import { ReactNode } from "react";
import ArrowForward from "@mui/icons-material/ArrowForward";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";

interface Props {
  title: string;
  avatar: ReactNode;
  description: string;
  actionLabel: string;
  href: string;
}

interface AvatarProps {
  variant: "chat" | "last_chat_entry" | "profile";
  src?: string;
  children?: ReactNode;
}

export const Avatar = ({ variant, src, children }: AvatarProps) => {
  const isChat = variant === "chat";
  const isProfile = variant === "profile";
  const isChatEntry = variant === "last_chat_entry";
  return (
    <>
      {(isChat || isProfile) && (
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"48px"}
          height={"48px"}
          borderRadius={"40px"}
          bgcolor={isChat ? "primary.main" : "pink"}
        >
          {children}
        </Box>
      )}

      {isChatEntry && (
        <Box
          sx={{
            zIndex: 0,
            position: "relative",
            width: "48px",
            height: "48px",
            borderRadius: "48px",
            overflow: "hidden",
          }}
        >
          {!!src && (
            <Image
              src={src}
              alt={"template"}
              priority
              fill
              style={{
                objectFit: "cover",
              }}
            />
          )}
        </Box>
      )}
    </>
  );
};

const SuggestionCard = ({ title, description, avatar, actionLabel, href }: Props) => {
  return (
    <Stack
      border={"1px solid"}
      borderColor={"surface.3"}
      borderRadius={"16px"}
      width={{ xs: "290px", lg: "100%" }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        p={"16px 8px 16px 24px"}
        borderBottom={"1px solid"}
        borderColor={"surface.3"}
        justifyContent={"space-between"}
      >
        <Stack
          gap={1}
          flex={1}
        >
          <Typography
            fontSize={12}
            fontWeight={500}
            lineHeight={"14.4px"}
            letterSpacing={"2px"}
            textTransform={"uppercase"}
            color={"text.secondary"}
            sx={{
              opacity: 0.8,
            }}
          >
            {title}
          </Typography>
          <Typography
            fontSize={16}
            fontWeight={400}
            lineHeight={"22.4px"}
            letterSpacing={"0.17px"}
            color={"text.secondary"}
          >
            {description}
          </Typography>
        </Stack>

        {avatar}
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        p={"16px 8px 16px 24px"}
      >
        <Stack
          gap={1}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          width={"100%"}
        >
          <Typography
            fontSize={16}
            fontWeight={500}
            lineHeight={"19.2px"}
            letterSpacing={"0.17px"}
          >
            {actionLabel}
          </Typography>
          <Link href={href}>
            <IconButton
              sx={{
                border: "none",
                ":hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              <ArrowForward />
            </IconButton>
          </Link>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SuggestionCard;
