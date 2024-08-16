import { type ReactNode } from "react";
import Link from "next/link";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import useTruncate from "@/hooks/useTruncate";
import useBrowser from "@/hooks/useBrowser";
import { useRouter } from "next/router";

interface Props {
  title: string;
  avatar: ReactNode;
  description: string;
  actionLabel: string;
}

interface AvatarProps {
  variant: "chat" | "last_chat_entry" | "profile" | "explore";
  src?: string;
  children?: ReactNode;
}

export const Avatar = ({ variant, src, children }: AvatarProps) => {
  const isChat = variant === "chat";
  const isProfile = variant === "profile";
  const isChatEntry = variant === "last_chat_entry";
  const isExplore = variant === "explore";
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

      {(isChatEntry || isExplore) && (
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
              priority={true}
              sizes="(max-width: 600px) 40vw, (max-width: 900px) 35vw, 30vw"
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

const SuggestionCardWithoutLink = ({ title, description, avatar, actionLabel }: Props) => {
  const { truncate } = useTruncate();

  return (
    <Stack
      width={{ xs: "290px", md: "330px" }}
      sx={{
        border: "1px solid",
        borderColor: "surfaceContainerHighest",
        borderRadius: "16px",
        overflow: "hidden",
        ":hover": {
          bgcolor: "surfaceContainerHigh",
          cursor: "pointer",
        },
      }}
      className="suggest-card"
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        minHeight={"88px"}
        sx={{
          p: "16px 8px 16px 24px",
          borderBottom: "1px solid",
          borderColor: "surfaceContainerHighest",
        }}
      >
        <Stack
          gap={1}
          flex={1}
          pr={1}
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
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "1",
              overflow: "hidden",
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
            minHeight={"66px"}
            pt={"8px"}
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "3",
              overflow: "hidden",
            }}
          >
            {truncate(description, { length: 59 })}
          </Typography>
        </Stack>

        {avatar}
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        p={"16px 8px 16px 24px"}
        sx={{
          ":hover": {
            bgcolor: "surfaceContainerHighest",
          },
        }}
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

          <IconButton
            aria-label="Procced"
            sx={{
              border: "none",
              ":hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ArrowForward />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SuggestionCardWithoutLink;
